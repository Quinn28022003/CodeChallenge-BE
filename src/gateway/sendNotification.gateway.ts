import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { Connections } from 'src/_connections/models/Connections.schema'
import { ConnectionsServices } from 'src/_connections/services/Connections.services'
import { NotificationServices } from 'src/_notifications/services/Notification.services'
import { RequestServices } from 'src/_request/services/Request.services'
import { UserServices } from 'src/_users/services/Users.services'
import { Status } from 'src/enums/RequestType'
import { INotification } from 'src/interfaces/Notification'
import { IcreateRequest } from 'src/interfaces/Request'
import { IcreateResponse } from 'src/interfaces/Response'
import { ICreateNotificationBody } from 'src/interfaces/Subscriber'

@WebSocketGateway({ cors: process.env.URL_FRONTEND })
export class SendNotificationGateway {
	@WebSocketServer() server: Server

	private users = new Map<string, Socket>()

	constructor(
		private readonly connectionServices: ConnectionsServices,
		private readonly notificationServices: NotificationServices,
		private readonly userServices: UserServices,
		private readonly requestServices: RequestServices
	) {}

	handleConnection(client: Socket) {
		this.users.set(client.id, client)
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client.id)
	}

	@SubscribeMessage('createRequest')
	async handleSendNotificationReq(client: Socket, data: IcreateRequest) {
		try {
			const check: Connections = await this.connectionServices.findfield(
				'userId',
				new mongoose.Types.ObjectId(data.receiver)
			)

			const body: ICreateNotificationBody = {
				title: data.title,
				sender: new mongoose.Types.ObjectId(data.sender),
				receiver: new mongoose.Types.ObjectId(data.receiver),
				idRequest: new mongoose.Types.ObjectId(data.idRequest),
				path: '/see-request'
			}

			const notification: INotification = await this.notificationServices.create(body)

			if (notification) {
				await this.userServices.updateNotification(data.receiver, notification._id)
			}

			if (check) {
				const roomId: string = uuidv4()
				client.join(roomId)

				const targetUserId: string = check.idSocketIo

				const targetUser: Socket = this.users.get(targetUserId)
				if (targetUser) {
					targetUser.join(roomId)
				}
				client.to(roomId).emit('notification', 'You have a new request')
			}
		} catch (error) {
			console.error('Error occurred during handle send notification request:', error)
		}
	}

	@SubscribeMessage('createResponse')
	async handleSendNotificationRes(client: Socket, data: IcreateResponse) {
		try {
			switch (data.status) {
				case Status.APPROVED: {
					const checkNotification: INotification = await this.notificationServices.findOneByField(
						'idRequest',
						new mongoose.Types.ObjectId(data.idRequest)
					)

					if (checkNotification) {
						await this.notificationServices.deleteByIdRequest(data.idRequest)
					}

					const bodyUpdate: any = {
						status: Status.APPROVED
					}
					await this.requestServices.update(data.idRequest, bodyUpdate)

					break
				}

				case Status.COMPLETED: {
					break
				}

				case Status.REJECTED: {
					const checkNotification: INotification = await this.notificationServices.findOneByField(
						'idRequest',
						new mongoose.Types.ObjectId(data.idRequest)
					)

					if (checkNotification) {
						await this.notificationServices.deleteByIdRequest(data.idRequest)
					}

					const bodyUpdate: any = {
						status: Status.REJECTED
					}
					await this.requestServices.update(data.idRequest, bodyUpdate)
					await this.requestServices.softDelete(data.idRequest)
					const check: Connections = await this.connectionServices.findfield(
						'userId',
						new mongoose.Types.ObjectId(data.receiver)
					)
					const body: ICreateNotificationBody = {
						title: data.title,
						sender: new mongoose.Types.ObjectId(data.sender),
						receiver: new mongoose.Types.ObjectId(data.receiver)
					}
					const notification: INotification = await this.notificationServices.create(body)
					if (notification) {
						await this.userServices.updateNotification(data.receiver, notification._id)
					}
					if (check) {
						const roomId: string = uuidv4()
						client.join(roomId)
						const targetUserId: string = check.idSocketIo
						const targetUser: Socket = this.users.get(targetUserId)
						if (targetUser) {
							targetUser.join(roomId)
						}
						client.to(roomId).emit('notification', 'You have a new request')
					}
					break
				}
			}
		} catch (error) {
			console.error('Error occurred during handle send notification response:', error)
		}
	}
}
