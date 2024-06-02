import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'
import { ReviewerServices } from 'src/_reviewer/services/Reviewer.services'
import { UserGetFieldDto } from 'src/_users/dto/UserGetByField.dto'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/ParseObjectId.pipe'
import { IUsersConvert } from 'src/interfaces/Users'

@Controller('reviewer')
export class ReviewerController {
	constructor(private ReviewerServices: ReviewerServices) {}

	@Get('')
	async list(@Res() res: Response, @Query() body: UserGetFieldDto): Promise<Response> {
		try {
			if (!body) {
				throw new HttpException('Body empty', HttpStatus.BAD_REQUEST)
			}
			const data: IUsersConvert[] = await this.ReviewerServices.list(body)
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
			const data: IUsersConvert = await this.ReviewerServices.detail(param)
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
