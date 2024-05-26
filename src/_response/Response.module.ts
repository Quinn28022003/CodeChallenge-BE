import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ResponseController } from 'src/_response/controllers/Response.controller'
import ResponseSchema from 'src/_response/models/Response.schema'
import { ResponseRepository } from 'src/_response/repository/Response.repository'
import { ResponseServices } from 'src/_response/services/Response.services'
import { ValiadateSendRespose } from 'src/middlewares/Response/ValiadateSendRespose'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'response',
				schema: ResponseSchema
			}
		])
	],
	controllers: [ResponseController],
	providers: [ResponseServices, ResponseRepository]
})
export class ResponseModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValiadateSendRespose).forRoutes({ path: 'response', method: RequestMethod.POST })
	}
}
