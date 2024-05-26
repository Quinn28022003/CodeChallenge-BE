import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Messagecontroller } from 'src/_message/controllers/Message.controller'
import MessageSchema from 'src/_message/models/Message.schema'
import { MessageRepository } from 'src/_message/repository/Message.repository'
import { MessageServices } from 'src/_message/services/Message.services'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'messages',
				schema: MessageSchema
			}
		])
	],
	controllers: [Messagecontroller],
	providers: [MessageRepository, MessageServices],
	exports: [MessageServices]
})
export class MessageModule {}
