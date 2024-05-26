import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Response } from 'src/_response/models/Response.schema'

export class ResponseRepository {
	constructor(@InjectModel('response') private readonly responseModel: Model<Response>) {}

	async create(body: any): Promise<Response> {
		const data: Response = await this.responseModel.create(body)
		return data
	}
}
