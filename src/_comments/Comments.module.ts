import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommnetController } from 'src/_comments/controllers/Comment.controller'
import CommentsSchema from 'src/_comments/models/Comments.schema'
import { CommentRepository } from 'src/_comments/repository/Comment.repository'
import { CommentServices } from 'src/_comments/services/Comment.services'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'comments',
				schema: CommentsSchema
			}
		])
	],
	controllers: [CommnetController],
	providers: [CommentServices, CommentRepository]
})
export class CommentModule {}
