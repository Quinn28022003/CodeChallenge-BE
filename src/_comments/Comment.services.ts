import { Injectable } from '@nestjs/common'
import { CommentRepository } from 'src/_comments/Comment.repository'
import { Comments } from 'src/_comments/Comments.schema'
import { CreateCommnetDto } from 'src/_comments/dto/CreateComment.dto'

@Injectable()
export class CommentServices {
	constructor(private readonly commentRepository: CommentRepository) {}

	async create(body: CreateCommnetDto): Promise<Comments> {
		const data: Comments = await this.commentRepository.create(body)
		return data
	}
}
