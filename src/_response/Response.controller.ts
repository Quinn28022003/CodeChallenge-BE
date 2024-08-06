import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'
import { ResponseCreateDto } from 'src/_response/dto/ResponseCreate.dto'

import { ResponseServices } from 'src/_response/Response.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/ParseObjectId.pipe'
import { IResponseConvert } from 'src/interfaces/Response'

@Controller('response')
export class ResponseController {
	constructor(private readonly ResponseServices: ResponseServices) {}

	@Get(':id')
	async listByReceiver(
		@Res() res: Response,
		@Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId
	): Promise<Response> {
		try {
			const data: IResponseConvert[] = await this.ResponseServices.findByField(new mongoose.Types.ObjectId(param))
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

	@Post('')
	async sendFeedback(@Res() res: Response, @Body() body: ResponseCreateDto): Promise<Response> {
		try {
			const reqBody: ResponseCreateDto = ResponseCreateDto.plainToClass(body)
			const dataReal: ResponseCreateDto = {
				...reqBody,
				sender: new mongoose.Types.ObjectId(reqBody.sender),
				receiver: new mongoose.Types.ObjectId(reqBody.receiver)
			}
			const data: any = await this.ResponseServices.create(dataReal)
			return ServerResponse.success(res, {
				data: data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Delete('softDel/:id')
	async softDelete(
		@Res() res: Response,
		@Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId
	): Promise<Response> {
		try {
			const data = await this.ResponseServices.softDelete(param)
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
