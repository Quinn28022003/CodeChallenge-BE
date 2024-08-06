import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { MessageServices } from 'src/_message/Message.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { IMessage } from 'src/interfaces/Message'

@Controller('message')
export class Messagecontroller {
	constructor(private readonly messageServices: MessageServices) {}

	@Get('')
	async listByUser(@Res() res: Response, @Query() body: IMessage) {
		try {
			const data: IMessage[] = await this.messageServices.findByField(body)
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
