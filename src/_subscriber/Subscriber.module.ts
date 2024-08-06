import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriberController } from 'src/_subscriber/Subscriber.controller'
import { SubscriberRepository } from 'src/_subscriber/Subscriber.repository'
import SubscriberSchema, { Subscriber } from 'src/_subscriber/Subscriber.schema'
import { SubscriberServices } from 'src/_subscriber/Subscriber.services'
import { ValidateUniqueFieldsSubscriberMdw } from 'src/middlewares/Subscriber/ValidateUniqueFieldsSubscriberMdw'

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
