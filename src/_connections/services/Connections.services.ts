import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'

import { Connections } from 'src/_connections/models/Connections.schema'
import { ConnectionsRepository } from 'src/_connections/repository/Connections.repository'
import { ConnectionCreate } from 'src/interfaces/Connection'
@Injectable()
export class ConnectionsServices {
	constructor(private readonly connectionsRepository: ConnectionsRepository) {}

	async findfield(field: string, value: mongoose.Types.ObjectId | string): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.findByfield(field, value)
			return data
		} catch (e) {
			console.log('Error services method findfield: ', e)
			throw e
		}
	}

	async createUserConnection(body: ConnectionCreate): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.create(body)
			return data
		} catch (e) {
			console.log('Error services method createUserConnection: ', e)
			throw e
		}
	}

	async updateConnectionByField(
		field: string,
		value: mongoose.Types.ObjectId | string,
		idSocketIo: string
	): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.update(field, value, idSocketIo)
			return data
		} catch (e) {
			console.log('Error services method updateConnection: ', e)
			throw e
		}
	}

	async updateByIdSocketIoConnection(
		userId: mongoose.Types.ObjectId | string,
		idSocketIo: string
	): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.updateByIdSocketIo(userId, idSocketIo)
			return data
		} catch (e) {
			console.log('Error services method updateByIdSocketIoConnection: ', e)
			throw e
		}
	}

	async deleteUserDisconnect(idSocketIo: string): Promise<DeleteResult> {
		try {
			const data: DeleteResult = await this.connectionsRepository.delete(idSocketIo)
			return data
		} catch (e) {
			console.log('Error services method deleteUserDisconnect: ', e)
			throw e
		}
	}
}
