import { ConfigService } from '@nestjs/config'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { AuthServices } from 'src/_auth/services/auth.services'
import { Connections } from 'src/_connections/models/Connections.schema'
import { ConnectionsServices } from 'src/_connections/services/Connections.services'
import { ConnectionCreate } from 'src/interfaces/Connection'
import { IVerifyToken } from 'src/interfaces/auth'
import { encrypt } from 'src/utils/encrypt'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
		credentials: true
	}
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	constructor(
		private readonly connectionsServices: ConnectionsServices,
		private readonly authServices: AuthServices,
		private readonly configService: ConfigService
	) {}

	@SubscribeMessage('login-connection')
	async handleLoginConnection(client: Socket, data: any): Promise<void> {
		await this.handleConnection(client, data)
		client.emit('login-connection', 'successfully')
	}

	@SubscribeMessage('logout-connection')
	async handleLogoutConnection(client: Socket): Promise<void> {
		await this.handleConnection(client)
		client.emit('logout-connection', 'logout successfully')
	}
	async handleConnection(client: Socket, tokenAndUserIdAndUseruuid?: any): Promise<void> {
		try {
			const cookiesFromHeaders: string = Array.isArray(client.request.headers.jwt)
				? client.request.headers.jwt[0]
				: client.request.headers.jwt
			const userIdFromHeaders: string = Array.isArray(client.request.headers.userid)
				? client.request.headers.userid[0]
				: client.request.headers.userid

			const useruuidFromHeaders: string = Array.isArray(client.request.headers.useruuid)
				? client.request.headers.useruuid[0]
				: client.request.headers.useruuid

			const idSocketIo: string = client.id

			if (cookiesFromHeaders && userIdFromHeaders && useruuidFromHeaders) {
				try {
					const data: IVerifyToken = await this.authServices.verifyToken(cookiesFromHeaders, userIdFromHeaders)
					const body: ConnectionCreate = {
						userId: data.user._id,
						useruuid: useruuidFromHeaders,
						idSocketIo
					}
					const checkStepOne: Connections = await this.connectionsServices.findfield('userId', data.user._id)

					const checkStepTwo: Connections = await this.connectionsServices.findfield('userId', useruuidFromHeaders)

					if (!checkStepOne && !checkStepTwo) {
						await this.connectionsServices.createUserConnection(body)
					} else {
						await this.connectionsServices.updateConnectionByField('userId', data.user._id, idSocketIo)
					}
					console.log('client connection:', idSocketIo)
					const ciphertext: string = await encrypt(data.user, this.configService.get<string>('SECRET_DATA'))

					client.emit('data', {
						user: ciphertext,
						accessToken: data.access_token,
						isLoggedIn: data.isLoggedIn
					})
				} catch (error) {
					client.emit('error', 'Token verification failed')
				}
			} else {
				if (tokenAndUserIdAndUseruuid) {
					try {
						const data: IVerifyToken = await this.authServices.verifyToken(
							tokenAndUserIdAndUseruuid.token,
							tokenAndUserIdAndUseruuid.userId
						)

						const body: any = {
							userId: data.user._id,
							useruuid: tokenAndUserIdAndUseruuid.useruuid,
							idSocketIo
						}

						const check: Connections = await this.connectionsServices.findfield('idSocketIo', idSocketIo)

						if (!check) {
							await this.connectionsServices.createUserConnection(body)
						} else {
							await this.connectionsServices.updateByIdSocketIoConnection(data.user._id, idSocketIo)
						}
						console.log('client connection:', idSocketIo)
						const ciphertext: string = await encrypt(data.user, this.configService.get<string>('SECRET_DATA'))
						client.emit('data', {
							user: ciphertext,
							isLoggedIn: data.isLoggedIn
						})
					} catch (error) {
						client.emit('error', 'Token verification failed')
					}
				} else {
					const useruuidFromHeaders: string = Array.isArray(client.request.headers.useruuid)
						? client.request.headers.useruuid[0]
						: client.request.headers.useruuid
					if (useruuidFromHeaders) {
						const checkUserId: Connections = await this.connectionsServices.findfield('useruuid', useruuidFromHeaders)
						if (!checkUserId) {
							const body: any = {
								useruuid: useruuidFromHeaders,
								idSocketIo
							}
							await this.connectionsServices.createUserConnection(body)
							console.log('Người dùng vãng lai')
							console.log('client connection:', client.id)
						} else {
							await this.connectionsServices.updateConnectionByField('useruuid', useruuidFromHeaders, idSocketIo)
							console.log('client connection:', idSocketIo)
						}
					} else {
						client.emit('error', 'Error when calling API to server')
					}
				}
			}
		} catch (error) {
			console.error('Error occurred during handleConnection:', error)
		}
	}

	async handleDisconnect(client: Socket): Promise<void> {
		try {
			console.log('Client disconnected:', client.id)
			const idSocketIo: string = client.id
			await this.connectionsServices.deleteUserDisconnect(idSocketIo)
		} catch (error) {
			console.error('Error occurred during handleDisconnect:', error)
		}
	}
}
