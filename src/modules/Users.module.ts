import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersController } from 'src/controllers/Users.controller'
import userSchema, { Users } from 'src/models/Users.schema'
import { UserServices } from 'src/services/Users.services'

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
