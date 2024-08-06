import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'

import { ConnectionsRepository } from 'src/_connections/Connections.repository'
import { Connections } from 'src/_connections/Connections.schema'
import { ConnectionCreate } from 'src/interfaces/Connection'
@Injectable()
export class ConnectionsServices {
	constructor(private readonly connectionsRepository: ConnectionsRepository) {}

	async findTotal(): Promise<number> {
		try {
			const data: number = await this.connectionsRepository.findQuantity()
			return data
		} catch (e) {
			console.log('Error connection services method findTotal: ', e)
			throw e
		}
	}

	async findAccount(): Promise<number> {
		try {
			const data: number = await this.connectionsRepository.findQuantityByUserId(true)
			return data
		} catch (e) {
			console.log('Error connection services method findAccount: ', e)
			throw e
		}
	}

	async findNotAccount(): Promise<number> {
		try {
			const data: number = await this.connectionsRepository.findQuantityByUserId(false)
			return data
		} catch (e) {
			console.log('Error connection services method findNotAccount: ', e)
			throw e
		}
	}

	async findfield(field: string, value: mongoose.Types.ObjectId | string): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.findByfield(field, value)
			return data
		} catch (e) {
			console.log('Error connection services method findfield: ', e)
			throw e
		}
	}

	async createUserConnection(body: ConnectionCreate): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsRepository.create(body)
			return data
		} catch (e) {
			console.log('Error connection services method createUserConnection: ', e)
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
			console.log('Error connection services method updateConnection: ', e)
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
			console.log('Error connection services method updateByIdSocketIoConnection: ', e)
			throw e
		}
	}

	async deleteUserDisconnect(idSocketIo: string): Promise<DeleteResult> {
		try {
			const data: DeleteResult = await this.connectionsRepository.delete(idSocketIo)
			return data
		} catch (e) {
			console.log('Error connection services method deleteUserDisconnect: ', e)
			throw e
		}
	}
}
