import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { Connections } from 'src/_connections/models/Connections.schema'
import { ConnectionsServices } from 'src/_connections/services/Connections.services'
import { NotificationServices } from 'src/_notifications/services/Notification.services'
import { UserServices } from 'src/_users/services/Users.services'
import { INotification } from 'src/interfaces/Notification'
import { ICreateNotificationBody } from 'src/interfaces/Subscriber'

@WebSocketGateway({ cors: process.env.URL_FRONTEND })
export class SendNotificationGateway {
	@WebSocketServer() server: Server

	private users = new Map<string, Socket>()

	constructor(
		private readonly connectionServices: ConnectionsServices,
		private readonly notificationServices: NotificationServices,
		private readonly userServices: UserServices
	) {}

	handleConnection(client: Socket) {
		this.users.set(client.id, client)
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client.id)
	}

	@SubscribeMessage('createRequest')
	async handleSendNotification(client: Socket, data: any) {
		try {
			const check: Connections = await this.connectionServices.findfield(
				'userId',
				new mongoose.Types.ObjectId(data.receiver)
			)

			const body: ICreateNotificationBody = {
				title: data.title,
				sender: new mongoose.Types.ObjectId(data.sender),
				receiver: new mongoose.Types.ObjectId(data.receiver),
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
			console.error('Error occurred during handleSendNotification:', error)
		}
	}
}
