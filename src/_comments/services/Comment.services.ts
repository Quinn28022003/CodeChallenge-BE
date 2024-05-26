import { Injectable } from '@nestjs/common'
import { CreateCommnetDto } from 'src/_comments/dto/CreateComment.dto'
import { Comments } from 'src/_comments/models/Comments.schema'
import { CommentRepository } from 'src/_comments/repository/Comment.repository'

@Injectable()
export class CommentServices {
	constructor(private readonly commentRepository: CommentRepository) {}

	async create(body: CreateCommnetDto): Promise<Comments> {
		const data: Comments = await this.commentRepository.create(body)
		return data
	}
}
