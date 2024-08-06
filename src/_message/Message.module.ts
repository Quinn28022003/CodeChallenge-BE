import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Messagecontroller } from 'src/_message/Message.controller'
import { MessageRepository } from 'src/_message/Message.repository'
import MessageSchema from 'src/_message/Message.schema'
import { MessageServices } from 'src/_message/Message.services'

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
