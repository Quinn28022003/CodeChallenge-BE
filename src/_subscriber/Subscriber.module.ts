import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriberController } from 'src/_subscriber/controllers/Subscriber.controller'
import SubscriberSchema, { Subscriber } from 'src/_subscriber/models/Subscriber.schema'
import { SubscriberRepository } from 'src/_subscriber/repository/Subscriber.repository'
import { SubscriberServices } from 'src/_subscriber/services/Subscriber.services'
import { ValidateUniqueFieldsSubscriberMdw } from 'src/middlewares/ValidateUniqueFieldsSubscriberMdw'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Subscriber.name,
				schema: SubscriberSchema
			}
		]),
		ConfigModule
	],
	controllers: [SubscriberController],
	providers: [SubscriberServices, SubscriberRepository]
})
export class SubscriberModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValidateUniqueFieldsSubscriberMdw).forRoutes({ path: '/subscriber', method: RequestMethod.POST })
	}
}
