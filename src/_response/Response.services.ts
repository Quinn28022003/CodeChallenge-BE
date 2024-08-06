import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'

import { ResponseRepository } from 'src/_response/Response.repository'
import { Response } from 'src/_response/Response.schema'
import { ResponseCreateDto } from 'src/_response/dto/ResponseCreate.dto'
import { UserServices } from 'src/_users/Users.services'
import { IResponse, IResponseConvert } from 'src/interfaces/Response'
import { IUsersConvert } from 'src/interfaces/Users'
import { DateFormatter } from 'src/utils/ConvertDate'
import { ConvertImage } from 'src/utils/ConvertImage'

@Injectable()
export class ResponseServices {
	private initConvertImage: ConvertImage = null
	private initDateFormatter: DateFormatter = null
	constructor(
		private readonly responseRepository: ResponseRepository,
		private readonly userServices: UserServices
	) {
		this.initConvertImage = new ConvertImage()
		this.initDateFormatter = new DateFormatter()
	}

	async findByField(value: mongoose.Types.ObjectId): Promise<IResponseConvert[]> {
		try {
			const data: Response[] = await this.responseRepository.findByField('receiver', value)

			const container: IResponseConvert[] = await Promise.all(
				data.map(async (item: IResponse): Promise<IResponseConvert> => {
					const user: IUsersConvert = await this.userServices.findOneDetail(item.sender)
					const date: string = this.initDateFormatter.convert(item.createdAt)

					return {
						...item,
						sender: user,
						createdAt: date
					}
				})
			)
			return container
		} catch (e) {
			console.log('Error response services method findByField')
			throw e
		}
	}

	async create(body: ResponseCreateDto): Promise<Response> {
		try {
			const data: Response = await this.responseRepository.create(body)
			return data
		} catch (e) {
			console.log('Error response services method create')
			throw e
		}
	}

	async softDelete(requestId: mongoose.Types.ObjectId): Promise<DeleteResult> {
		const deleteRequestAndFiles = await this.responseRepository.softDelete(requestId)
		return deleteRequestAndFiles
	}
}
