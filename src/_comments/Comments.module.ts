import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommnetController } from 'src/_comments/Comment.controller'
import { CommentRepository } from 'src/_comments/Comment.repository'
import { CommentServices } from 'src/_comments/Comment.services'
import CommentsSchema from 'src/_comments/Comments.schema'

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
