import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NotificationController } from 'src/_notifications/Notification.controller'
import { NotificationRepository } from 'src/_notifications/Notification.repository'
import NotificationSchema from 'src/_notifications/Notification.schema'
import { NotificationServices } from 'src/_notifications/Notification.services'
import { UsersModule } from 'src/_users/Users.module'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'notifications',
				schema: NotificationSchema
			}
		]),
		UsersModule
	],
	controllers: [NotificationController],
	providers: [NotificationServices, NotificationRepository],
	exports: [NotificationServices]
})
export class NotificationModule {}
