import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { ReviewerServices } from 'src/_reviewer/services/Reviewer.services'
import { IfindAll } from 'src/interfaces/Users'

@Controller('reviewer')
export class ReviewerController {
	constructor(private ReviewerServices: ReviewerServices) {}

	@Get('')
	async list(@Res() res: Response) {
		try {
			const data: IfindAll[] = await this.ReviewerServices.list()
			res.status(HttpStatus.OK).json({
				data
			})
		} catch (error) {
			throw new HttpException(
				'Det oppstod en feil under behandlingen av forespørselen.',
				HttpStatus.SERVICE_UNAVAILABLE
			)
		}
	}

	@Get(':id')
	async detail(@Res() res: Response, @Param('id') param: string) {
		try {
			const data: IfindAll = await this.ReviewerServices.detail(param)
			const { password, refreshToken, ...user } = data
			res.status(HttpStatus.OK).json({
				user
			})
		} catch (error) {
			throw new HttpException(
				'Det oppstod en feil under behandlingen av forespørselen.',
				HttpStatus.SERVICE_UNAVAILABLE
			)
		}
	}
}
