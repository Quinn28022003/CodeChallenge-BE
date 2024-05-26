import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from 'src/_auth/auth.module'
import { ChallengeModule } from 'src/_challenge/Challenge.module'
import { CommentModule } from 'src/_comments/Comments.module'
import { ConnectionModule } from 'src/_connections/Connections.module'
import { FilesModule } from 'src/_files/Files.module'
import { MessageModule } from 'src/_message/Message.module'
import { NotificationModule } from 'src/_notifications/Notification.module'
import { RequestModule } from 'src/_request/Request.module'
import { ResponseModule } from 'src/_response/Response.module'
import { ReviewerModule } from 'src/_reviewer/Reviewer.module'
import { SubscriberModule } from 'src/_subscriber/Subscriber.module'
import { UsersModule } from 'src/_users/Users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ConnectionModule,
		UsersModule,
		AuthModule,
		ReviewerModule,
		SubscriberModule,
		ChallengeModule,
		FilesModule,
		RequestModule,
		CommentModule,
		ResponseModule,
		NotificationModule,
		MessageModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
				connectionFactory: connection => {
					connection.plugin(require('mongoose-delete'))
					return connection
				}
			})
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
