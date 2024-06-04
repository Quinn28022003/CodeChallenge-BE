import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose, { UpdateWriteOpResult } from 'mongoose'

import { RequestDto } from 'src/_request/dto/Request.Dto'
import { RequestGetByFieldDto } from 'src/_request/dto/RequestGetByField.Dto'
import { RequestUpdateDto } from 'src/_request/dto/RequestUpdate.Dto'
import { Request } from 'src/_request/models/Request.schema'
import { RequestRepository } from 'src/_request/repository/Request.repository'
import { UserServices } from 'src/_users/services/Users.services'
import { IRequest, IRequestConvert, IRequestGetByFieldDto } from 'src/interfaces/Request'
import { IUsersConvert } from 'src/interfaces/Users'

@Injectable()
export class RequestServices {
	constructor(
		private readonly requestRepository: RequestRepository,
		private readonly userServices: UserServices
	) {}

	async findAll(): Promise<Request[]> {
		const data: Request[] = await this.requestRepository.find()
		return data
	}

	async findDeleted(): Promise<IRequestConvert[]> {
		const data: Request[] = await this.requestRepository.findDeleted()
		const container: IRequestConvert[] = await Promise.all(
			data.map(async (item: IRequest): Promise<IRequestConvert> => {
				const userReal: IUsersConvert = await this.userServices.findOneDetail(
					new mongoose.Types.ObjectId(item.sender.toString())
				)
				const createdAtDate: Date = new Date(item.createdAt)
				const formattedCreatedAt: string = `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`
				return { ...item, sender: userReal, createdAt: formattedCreatedAt }
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
				const createdAtDate: Date = new Date(item.createdAt)
				const formattedCreatedAt: string = `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`
				return { ...item, sender: userReal, createdAt: formattedCreatedAt }
			})
		)

		return container
	}

	async findDetail(id: mongoose.Types.ObjectId): Promise<Request> {
		const data: Request = await this.requestRepository.findOne(id)
		return data
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
