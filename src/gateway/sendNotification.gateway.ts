import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { Connections } from 'src/_connections/Connections.schema'
import { ConnectionsServices } from 'src/_connections/Connections.services'
import { NotificationServices } from 'src/_notifications/Notification.services'
import { RequestServices } from 'src/_request/Request.services'
import { ResponseServices } from 'src/_response/Response.services'
import { UserServices } from 'src/_users/Users.services'
import { Status } from 'src/enums/RequestType'
import { IReview } from 'src/interfaces/Gateway'
import { INotification } from 'src/interfaces/Notification'
import { IcreateRequest } from 'src/interfaces/Request'
import { ICreateResponse } from 'src/interfaces/Response'
import { ICreateNotificationBody } from 'src/interfaces/Subscriber'

@WebSocketGateway({ cors: process.env.URL_FRONTEND })
export class SendNotificationGateway {
	@WebSocketServer() server: Server

	private users = new Map<string, Socket>()

	constructor(
		private readonly connectionServices: ConnectionsServices,
		private readonly notificationServices: NotificationServices,
		private readonly userServices: UserServices,
		private readonly requestServices: RequestServices,
		private readonly responseServices: ResponseServices
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
				title: data.description,
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
	async handleSendNotificationRes(client: Socket, data: ICreateResponse) {
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
					try {
						const check: Connections = await this.connectionServices.findfield(
							'userId',
							new mongoose.Types.ObjectId(data.receiver)
						)

						const bodyUpdate: any = {
							status: Status.COMPLETED
						}
						await this.requestServices.update(data.idRequest, bodyUpdate)

						const body: ICreateNotificationBody = {
							title: data.description,
							sender: new mongoose.Types.ObjectId(data.sender),
							receiver: new mongoose.Types.ObjectId(data.receiver),
							idRequest: new mongoose.Types.ObjectId(data.idRequest),
							path: '/account/response'
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
						title: data.description,
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

	@SubscribeMessage('review')
	async handleReview(client: Socket, data: IReview) {
		try {
			const check: Connections = await this.connectionServices.findfield(
				'userId',
				new mongoose.Types.ObjectId(data.receiver)
			)

			const body: ICreateNotificationBody = {
				title: data.description,
				sender: new mongoose.Types.ObjectId(data.sender),
				receiver: new mongoose.Types.ObjectId(data.receiver)
			}

			const notification: INotification = await this.notificationServices.create(body)

			if (notification) {
				await this.userServices.updateNotification(data.receiver, notification._id)
				await this.userServices.updateRating(data.receiver, data.rating)
				await this.responseServices.softDelete(new mongoose.Types.ObjectId(data.idResponse))
			}

			if (check) {
				const roomId: string = uuidv4()
				client.join(roomId)

				const targetUserId: string = check.idSocketIo

				const targetUser: Socket = this.users.get(targetUserId)
				if (targetUser) targetUser.join(roomId)
				client.to(roomId).emit('notification', 'You have a new request')
			}
		} catch (error) {
			console.error('Error occurred during handle review:', error)
		}
	}
}
