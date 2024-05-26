import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'

import { Messages } from 'src/_message/models/Message.schema'
import { MessageRepository } from 'src/_message/repository/Message.repository'
import { IMessage, IMessageCreate } from 'src/interfaces/Message'
import { DateFormatter } from 'src/utils/convertDate'
import { TimeFormatter } from 'src/utils/convertTime'

@Injectable()
export class MessageServices {
	private initTimeFormatter: TimeFormatter = null
	private initDateFormatter: DateFormatter = null

	constructor(private readonly messageRepository: MessageRepository) {
		this.initTimeFormatter = new TimeFormatter()
		this.initDateFormatter = new DateFormatter()
	}

	async findByField(body: IMessage): Promise<IMessage[]> {
		try {
			const dataConvert: IMessage = {
				sender: new mongoose.Types.ObjectId(body.sender),
				receiver: new mongoose.Types.ObjectId(body.receiver)
			}
			const messages: IMessage[] = await this.messageRepository.findByField(dataConvert)

			const messagesWithFormattedDate: IMessage[] = messages.map((message: IMessage): IMessage => {
				const date = new Date(message.createdAt)
				const formattedDate: string = this.initDateFormatter.convert(date)
				const formattedTime: string = this.initTimeFormatter.convert(date)

				return {
					...message,
					createdAt: formattedDate,
					time: formattedTime
				}
			})

			return messagesWithFormattedDate
		} catch (e) {
			console.log('error message services method findByField: ', e)
			throw e
		}
	}

	async create(body: IMessageCreate): Promise<Messages> {
		try {
			const data: Messages = await this.messageRepository.create(body)
			return data
		} catch (e) {
			console.log('Error message services method create: ', e)
			throw e
		}
	}
}
