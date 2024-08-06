import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DeleteResult } from 'mongodb'
import mongoose, { Model } from 'mongoose'

import { Connections, ConnectionsDocument } from 'src/_connections/Connections.schema'
import { ConnectionCreate } from 'src/interfaces/Connection'

@Injectable()
export class ConnectionsRepository {
	constructor(@InjectModel('connections') private readonly connectionsModel: Model<ConnectionsDocument>) {}

	async findQuantity(): Promise<number> {
		try {
			const data: number = await this.connectionsModel.findOne().countDocuments()
			return data
		} catch (e) {
			console.log('Error connection repository method findQuantity: ', e)
			throw e
		}
	}

	async findQuantityByUserId(value: boolean): Promise<number> {
		try {
			const data: number = await this.connectionsModel.countDocuments({ userId: { $exists: value } }).exec()
			return data
		} catch (e) {
			console.log('Error connection repository method findQuantityByUserId: ', e)
			throw e
		}
	}

	async findByfield(field: string, value: mongoose.Types.ObjectId | string): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsModel.findOne({ [field]: value })
			return data
		} catch (e) {
			console.log('Error connection repository method findByfield: ', e)
			throw e
		}
	}

	async create(body: ConnectionCreate): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsModel.create(body)
			return data
		} catch (e) {
			console.log('Error connection repository method create: ', e)
			throw e
		}
	}

	async update(field: string, value: mongoose.Types.ObjectId | string, idSocketIo: string): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsModel
				.findOneAndUpdate({ [field]: value }, { idSocketIo }, { new: true })
				.exec()
			return data
		} catch (e) {
			console.log('Error connection repository method update: ', e)
			throw e
		}
	}

	async updateByIdSocketIo(userId: mongoose.Types.ObjectId | string, idSocketIo: string): Promise<Connections> {
		try {
			const data: Connections = await this.connectionsModel
				.findOneAndUpdate({ idSocketIo }, { idSocketIo, userId }, { new: true })
				.exec()
			return data
		} catch (e) {
			console.log('Error connection repository method updateByIdSocketIo: ', e)
			throw e
		}
	}

	async delete(idSocketIo: string): Promise<DeleteResult> {
		try {
			const data: DeleteResult = await this.connectionsModel.deleteOne({ idSocketIo })
			return data
		} catch (e) {
			console.log('Error connection repository method delete: ', e)
			throw e
		}
	}
}
