import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NotificationController } from 'src/_notifications/Controllers/Notification.controller'
import NotificationSchema from 'src/_notifications/models/Notification.schema'
import { NotificationRepository } from 'src/_notifications/repositoty/Notification.repository'
import { NotificationServices } from 'src/_notifications/services/Notification.services'
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
