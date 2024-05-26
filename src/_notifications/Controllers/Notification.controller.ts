import { Controller, Delete, Get, HttpStatus, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'

import { NotificationServices } from 'src/_notifications/services/Notification.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/parseObjectId.pipe'

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationServices: NotificationServices) {}

	@Get(':id')
	async findByUser(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.notificationServices.findByField('receiver', param)
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
	async Delete(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.notificationServices.delete(param)
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
