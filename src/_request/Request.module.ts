import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectionModule } from 'src/_connections/Connections.module'
import { NotificationModule } from 'src/_notifications/Notification.module'

import { RequestController } from 'src/_request/controllers/Request.controller'
import RequestSchema, { Request } from 'src/_request/models/Request.schema'
import { RequestRepository } from 'src/_request/repository/Request.repository'
import { RequestServices } from 'src/_request/services/Request.services'
import { UsersModule } from 'src/_users/Users.module'
import { SendNotificationGateway } from 'src/gateway/SendNotification.gateway'
import { ValiadateRequestUpdate } from 'src/middlewares/Request/ValiadateRequestUpdate'
import { ValiadateSendRequest } from 'src/middlewares/Request/ValiadateSendRequest'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Request.name,
				schema: RequestSchema
			}
		]),
		NotificationModule,
		ConnectionModule,
		UsersModule
	],
	controllers: [RequestController],
	providers: [RequestServices, RequestRepository, SendNotificationGateway],
	exports: [RequestServices]
})
export class RequestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValiadateSendRequest).forRoutes({ path: 'request', method: RequestMethod.POST }),
			consumer.apply(ValiadateRequestUpdate).forRoutes({ path: 'request/byField/:id', method: RequestMethod.PUT })
	}
}
