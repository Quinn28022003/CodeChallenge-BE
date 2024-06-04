import { InjectModel } from '@nestjs/mongoose'
import { SoftDeleteModel } from 'mongoose-delete'

import { Response, ResponseDocument } from 'src/_response/models/Response.schema'

export class ResponseRepository {
	constructor(@InjectModel('response') private readonly responseModel: SoftDeleteModel<ResponseDocument>) {}

	async create(body: any): Promise<Response> {
		const data: Response = await this.responseModel.create(body)
		return data
	}
}
