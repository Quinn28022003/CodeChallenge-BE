import { Injectable } from '@nestjs/common'
import { Response } from 'src/_response/models/Response.schema'

import { ResponseRepository } from 'src/_response/repository/Response.repository'

@Injectable()
export class ResponseServices {
	constructor(private readonly responseRepository: ResponseRepository) {}

	async create(body: any): Promise<Response> {
		const data: Response = await this.responseRepository.create(body)
		return data
	}
}
