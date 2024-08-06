import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { SoftDeleteModel } from 'mongoose-delete'
import { ResponseCreateDto } from 'src/_response/dto/ResponseCreate.dto'

import { Response, ResponseDocument } from 'src/_response/Response.schema'

export class ResponseRepository {
	constructor(@InjectModel('responses') private readonly responseModel: SoftDeleteModel<ResponseDocument>) {}

	async findByField(field: string, value: mongoose.Types.ObjectId | string | number | boolean): Promise<Response[]> {
		try {
			const data: Response[] = await this.responseModel
				.find({ [field]: value })
				.sort({ createdAt: -1 })
				.lean()
			return data
		} catch (e) {
			console.log('Error response repository method findByField')
			throw e
		}
	}

	async create(body: ResponseCreateDto): Promise<Response> {
		try {
			const data: Response = await this.responseModel.create(body)
			return data
		} catch (e) {
			console.log('Error response repository method create')
			throw e
		}
	}

	async softDelete(requestId: mongoose.Types.ObjectId): Promise<any> {
		return this.responseModel.delete({ _id: requestId }).exec()
	}
}
