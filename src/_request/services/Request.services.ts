import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { NotificationServices } from 'src/_notifications/services/Notification.services'

import { RequestDto } from 'src/_request/dto/Request.Dto'
import { RequestUpdateDto } from 'src/_request/dto/RequestUpdate.Dto'
import { Request } from 'src/_request/models/Request.schema'
import { RequestRepository } from 'src/_request/repository/Request.repository'
import { UserServices } from 'src/_users/services/Users.services'
import { IUsersConvert } from 'src/interfaces/Users'
import { ConvertImage } from 'src/utils/convertImage'

@Injectable()
export class RequestServices {
	constructor(
		private readonly requestRepository: RequestRepository,
		private readonly notificationServices: NotificationServices,
		private readonly userServices: UserServices
	) {}

	async findAll(): Promise<Request[]> {
		const data: Request[] = await this.requestRepository.find()
		return data
	}

	async findAllByReceiver(value: mongoose.Types.ObjectId): Promise<any> {
		const data: Request[] = await this.requestRepository.findByReceiver('receiver', value)
		console.log('data: ', data)
		const initConvertImage = new ConvertImage()

		const container = await Promise.all(
			data.map(async (item: any | Request) => {
				const userReal: IUsersConvert = await this.userServices.findOneDetail(
					new mongoose.Types.ObjectId(item.sender.toString())
				)
				const createdAtDate: Date = new Date(item.createdAt)
				const formattedCreatedAt: string = `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`
				return { ...item.toObject(), sender: userReal, createdAt: formattedCreatedAt }
			})
		)

		return container
	}

	async findDetail(id: mongoose.Schema.Types.ObjectId): Promise<Request> {
		const data: Request = await this.requestRepository.findOne(id)
		return data
	}

	async sendRequest(body: RequestDto): Promise<Request> {
		const data: Request = await this.requestRepository.create(body)
		return data
	}

	async delete(requestId: mongoose.Schema.Types.ObjectId): Promise<DeleteResult> {
		const deleteRequestAndFiles = await this.requestRepository.delete(requestId)
		return deleteRequestAndFiles
	}

	async update(requestId: mongoose.Types.ObjectId, body: RequestUpdateDto): Promise<UpdateWriteOpResult> {
		const data: UpdateWriteOpResult = await this.requestRepository.update(requestId, body)
		return data
	}

	async softDelete(requestId: mongoose.Schema.Types.ObjectId): Promise<DeleteResult> {
		const deleteRequestAndFiles = await this.requestRepository.softDelete(requestId)
		return deleteRequestAndFiles
	}
}
