import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from 'src/_users/Users.controller'
import userSchema from 'src/_users/Users.schema'

import { UsersRepository } from 'src/_users/Users.repository'
import { UserServices } from 'src/_users/Users.services'
import { ValidateUniqueFieldsUserMdw } from 'src/middlewares/User/ValidateUniqueFieldsUserMdw'
import { ValidateUserCreateMdw } from 'src/middlewares/User/ValidateUserCreateMdw'
import { ValidateUserUpdateMdw } from 'src/middlewares/User/ValidateUserUpdateMdw'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'users',
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
			.apply(ValidateUserCreateMdw, ValidateUniqueFieldsUserMdw)
			.forRoutes({ path: 'users', method: RequestMethod.POST }),
			consumer
				.apply(ValidateUserUpdateMdw, ValidateUniqueFieldsUserMdw)
				.forRoutes({ path: 'users/:id', method: RequestMethod.PUT })
	}
}
