import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ResponseController } from 'src/_response/Response.controller'
import { ResponseRepository } from 'src/_response/Response.repository'
import ResponseSchema from 'src/_response/Response.schema'
import { ResponseServices } from 'src/_response/Response.services'
import { UsersModule } from 'src/_users/Users.module'
import { ValiadateSendRespose } from 'src/middlewares/Response/ValiadateSendRespose'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'responses',
				schema: ResponseSchema
			}
		]),
		UsersModule
	],
	controllers: [ResponseController],
	providers: [ResponseServices, ResponseRepository],
	exports: [ResponseServices]
})
export class ResponseModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValiadateSendRespose).forRoutes({ path: 'response', method: RequestMethod.POST })
	}
}
