import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import userSchema, { Users } from 'src/models/Users.schema'
import { UsersController } from 'src/users/controllers/Users.controller'
import { UserServices } from 'src/users/services/Users.services'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Users.name,
				schema: userSchema
			}
		])
	],
	controllers: [UsersController],
	providers: [UserServices]
})
export class UsersModule {}
