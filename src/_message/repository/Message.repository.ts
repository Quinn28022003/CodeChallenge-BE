import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { MessageDocument, Messages } from 'src/_message/models/Message.schema'
import { IMessage, IMessageCreate } from 'src/interfaces/Message'

@Injectable()
export class MessageRepository {
	constructor(@InjectModel('messages') private readonly messageModel: Model<MessageDocument>) {}

	async findByField(body: IMessage): Promise<Messages[]> {
		try {
			const users: Messages[] = await this.messageModel
				.find({
					$or: [
						{ sender: body.sender, receiver: body.receiver },
						{ sender: body.receiver, receiver: body.sender }
					]
				})
				.sort({ createdAt: -1 })
				.lean()
			return users
		} catch (e) {
			console.log('error message repository method findByField: ', e)
			throw e
		}
	}

	async create(body: IMessageCreate): Promise<Messages> {
		try {
			const data: Messages = await this.messageModel.create(body)
			return data
		} catch (e) {
			console.log('Error repository method create: ', e)
			throw e
		}
	}
}
