import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { RequestDto } from 'src/_request/dto/Request.Dto'
import { RequestGetByFieldDto } from 'src/_request/dto/RequestGetByField.Dto'
import { RequestUpdateDto } from 'src/_request/dto/RequestUpdate.Dto'
import { RequestServices } from 'src/_request/services/Request.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/ParseObjectId.pipe'
import { IRequest, IRequestConvert } from 'src/interfaces/Request'

@Controller('request')
export class RequestController {
	constructor(private readonly requestServices: RequestServices) {}

	@Get('')
	async list(@Res() res: Response) {
		try {
			const data: IRequest[] = await this.requestServices.findAll()
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

	@Get('deleted/:id')
	async findDeleted(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data: IRequestConvert[] = await this.requestServices.findDeleted(param)
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

	@Get('byField')
	async findByField(@Res() res: Response, @Query() body: RequestGetByFieldDto) {
		try {
			const data: any = await this.requestServices.findByField(body)
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

	@Get(':id')
	async detail(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data: any = await this.requestServices.findDetail(param)
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
	async sendRequest(@Res() res: Response, @Req() req: Request, @Body() body: RequestDto) {
		try {
			const reqBody: RequestDto = RequestDto.plainToClass(body)
			const dataReal: RequestDto = {
				...reqBody,
				sender: new mongoose.Types.ObjectId(reqBody.sender),
				receiver: new mongoose.Types.ObjectId(reqBody.receiver)
			}
			const data: any = await this.requestServices.sendRequest(dataReal)
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

	@Put('byField/:id')
	async update(
		@Res() res: Response,
		@Body() body: RequestUpdateDto,
		@Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId
	) {
		try {
			const reqBody: RequestUpdateDto = RequestUpdateDto.plainToClass(body)
			const data = await this.requestServices.update(param, reqBody)
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

	@Delete(':id')
	async delete(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.requestServices.delete(param)
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

	@Delete('softDel/:id')
	async softDelete(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.requestServices.softDelete(param)
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
