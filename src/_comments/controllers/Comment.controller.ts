import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { CreateCommnetDto } from 'src/_comments/dto/CreateComment.dto'
import { Comments } from 'src/_comments/models/Comments.schema'
import { CommentServices } from 'src/_comments/services/Comment.services'
import ServerResponse from 'src/common/response/ServerResponse'

@Controller('comment')
export class CommnetController {
	constructor(private readonly commentServices: CommentServices) {}

	@Post('')
	async createComment(@Res() res: Response, @Body() body: CreateCommnetDto) {
		try {
			const bodyReal: CreateCommnetDto = CreateCommnetDto.plainToClass(body)
			const data: Comments = await this.commentServices.create(bodyReal)
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
