import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCommnetDto } from 'src/_comments/dto/CreateComment.dto'
import { Comments } from 'src/_comments/models/Comments.schema'

@Injectable()
export class CommentRepository {
	constructor(@InjectModel('comments') private readonly commnetModel: Model<Comments>) {}

	async create(body: CreateCommnetDto): Promise<Comments> {
		const data: Comments = await this.commnetModel.create(body)
		return data
	}
}
