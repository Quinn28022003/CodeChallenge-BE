import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import mongoose, { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { Connections } from 'src/_connections/Connections.schema'
import { ConnectionsServices } from 'src/_connections/Connections.services'
import { MessageServices } from 'src/_message/Message.services'
import { IMessageCreate } from 'src/interfaces/Message'

@WebSocketGateway({ cors: process.env.URL_FRONTEND })
export class MessageGateway {
	@WebSocketServer() server: Server

	private users = new Map<string, Socket>()

	constructor(
		private readonly messageServices: MessageServices,
		private readonly connectionServices: ConnectionsServices
	) {}

	handleConnection(client: Socket) {
		this.users.set(client.id, client)
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client.id)
	}

	@SubscribeMessage('createMessage')
	async handleSendNotification(client: Socket, data: IMessageCreate) {
		try {
			if (
				Types.ObjectId.isValid(data.sender) &&
				Types.ObjectId.isValid(data.receiver) &&
				data.content &&
				data.content.trim() !== ''
			) {
				const check: Connections = await this.connectionServices.findfield(
					'userId',
					new mongoose.Types.ObjectId(data.receiver)
				)

				const body: IMessageCreate = {
					sender: new mongoose.Types.ObjectId(data.sender),
					receiver: new mongoose.Types.ObjectId(data.receiver),
					content: data.content
				}

				await this.messageServices.create(body)

				if (check) {
					const roomId: string = uuidv4()
					client.join(roomId)
					const targetUserId: string = check.idSocketIo
					const targetUser: Socket = this.users.get(targetUserId)
					if (targetUser) {
						targetUser.join(roomId)
					}
					client.to(roomId).emit('newMessage', 'You have a new message')
				}
			} else {
				client.emit('error-message', 'Please enter the correct data type and do not leave it blank!')
			}
		} catch (error) {
			client.emit('internal-server-error', 'Internal Server Error')
		}
	}
}
