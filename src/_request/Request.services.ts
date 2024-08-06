import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose, { UpdateWriteOpResult } from 'mongoose'

import { RequestRepository } from 'src/_request/Request.repository'
import { Request } from 'src/_request/Request.schema'
import { RequestDto } from 'src/_request/dto/Request.Dto'
import { RequestGetByFieldDto } from 'src/_request/dto/RequestGetByField.Dto'
import { RequestUpdateDto } from 'src/_request/dto/RequestUpdate.Dto'
import { UserServices } from 'src/_users/Users.services'
import { IRequest, IRequestConvert, IRequestGetByFieldDto, IRequestLatest } from 'src/interfaces/Request'
import { IUsersConvert } from 'src/interfaces/Users'
import { DateFormatter } from 'src/utils/ConvertDate'
import { ConvertImage } from 'src/utils/ConvertImage'

@Injectable()
export class RequestServices {
	private initConvertImage: ConvertImage = null
	private initDateFormatter: DateFormatter = null

	constructor(
		private readonly requestRepository: RequestRepository,
		private readonly userServices: UserServices
	) {
		this.initConvertImage = new ConvertImage()
		this.initDateFormatter = new DateFormatter()
	}

	async findAll(): Promise<Request[]> {
		const data: Request[] = await this.requestRepository.find()
		return data
	}

	async findDeleted(param: mongoose.Types.ObjectId): Promise<IRequestConvert[]> {
		const data: Request[] = await this.requestRepository.findDeleted(new mongoose.Types.ObjectId(param))
		const container: IRequestConvert[] = await Promise.all(
			data.map(async (item: IRequest): Promise<IRequestConvert> => {
				const userReal: IUsersConvert = await this.userServices.findOneDetail(
					new mongoose.Types.ObjectId(item.sender.toString())
				)
				const date: string = this.initDateFormatter.convert(item.createdAt)
				return { ...item, sender: userReal, createdAt: date }
			})
		)

		return container
	}

	async findRequestLatest(userId: mongoose.Types.ObjectId): Promise<IUsersConvert[]> {
		const data: IRequestLatest[] = await this.requestRepository.findRequestLatest(userId)

		const container: IUsersConvert[] = await Promise.all(
			data.map(async (item: IRequestLatest): Promise<IUsersConvert> => {
				const userReal: IUsersConvert = await this.userServices.findOneDetail(
					new mongoose.Types.ObjectId(item.sender.toString())
				)
				const date: string = this.initDateFormatter.convert(item.createdAt)
				return { ...userReal, createdAt: date }
			})
		)

		return container
	}

	async findByField(body: RequestGetByFieldDto): Promise<any> {
		const dataReal: IRequestGetByFieldDto = {
			receiver: new mongoose.Types.ObjectId(body.receiver),
			status: body.status
		}
		const data: Request[] = await this.requestRepository.findByField(dataReal)

		const container: IRequestConvert[] = await Promise.all(
			data.map(async (item: IRequest): Promise<IRequestConvert> => {
				const userReal: IUsersConvert = await this.userServices.findOneDetail(
					new mongoose.Types.ObjectId(item.sender.toString())
				)
				const date: string = this.initDateFormatter.convert(item.createdAt)
				return { ...item, sender: userReal, createdAt: date }
			})
		)

		return container
	}

	async findDetail(id: mongoose.Types.ObjectId): Promise<IRequestConvert> {
		const data: IRequest = await this.requestRepository.findOne(id)
		const userReal: IUsersConvert = await this.userServices.findOneDetail(
			new mongoose.Types.ObjectId(data.sender.toString())
		)
		const date: string = this.initDateFormatter.convert(data.createdAt)
		return { ...data, sender: userReal, createdAt: date }
	}

	async sendRequest(body: RequestDto): Promise<Request> {
		const data: Request = await this.requestRepository.create(body)
		return data
	}

	async delete(requestId: mongoose.Types.ObjectId): Promise<DeleteResult> {
		const deleteRequestAndFiles = await this.requestRepository.delete(requestId)
		return deleteRequestAndFiles
	}

	async update(requestId: mongoose.Types.ObjectId, body: RequestUpdateDto): Promise<UpdateWriteOpResult> {
		const data: UpdateWriteOpResult = await this.requestRepository.update(requestId, body)
		return data
	}

	async softDelete(requestId: mongoose.Types.ObjectId): Promise<DeleteResult> {
		const deleteRequestAndFiles = await this.requestRepository.softDelete(requestId)
		return deleteRequestAndFiles
	}
}
