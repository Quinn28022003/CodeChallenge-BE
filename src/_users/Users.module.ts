import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersController } from 'src/_users/controllers/Users.controller'
import userSchema, { Users } from 'src/_users/models/Users.schema'
import { UsersRepository } from 'src/_users/repository/Users.repository'
import { UserServices } from 'src/_users/services/Users.services'
import { ValidateUniqueFieldsUserMdw } from 'src/middlewares/ValidateUniqueFieldsUserMdw'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Users.name,
				schema: userSchema
			}
		]),
		ConfigModule
	],
	controllers: [UsersController],
	providers: [UserServices, UsersRepository],
	exports: [UserServices, UsersRepository]
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ValidateUniqueFieldsUserMdw)
			.forRoutes({ path: 'users', method: RequestMethod.POST }, { path: 'users/:id', method: RequestMethod.PUT })
	}
}
