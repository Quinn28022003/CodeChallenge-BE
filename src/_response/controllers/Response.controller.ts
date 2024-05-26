import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { ResponseDto } from 'src/_response/dto/Response.dto'
import { ResponseServices } from 'src/_response/services/Response.services'
import ServerResponse from 'src/common/response/ServerResponse'

@Controller('response')
export class ResponseController {
	constructor(private readonly ResponseServices: ResponseServices) {}

	@Post('')
	async sendFeedback(@Res() res: Response, @Body() body: ResponseDto): Promise<Response> {
		try {
			const dataReal: ResponseDto = ResponseDto.plainToClass(body)
			const data: any = await this.ResponseServices.create(dataReal)
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}
}
