import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'
import { Connections } from 'src/_connections/models/Connections.schema'
import { ConnectionsServices } from 'src/_connections/services/Connections.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/parseObjectId.pipe'

@Controller('connection')
export class ConnectionController {
	constructor(private readonly connectionsServices: ConnectionsServices) {}

	@Get(':id')
	async check(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data: Connections = await this.connectionsServices.findfield('userId', new mongoose.Types.ObjectId(param))
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
