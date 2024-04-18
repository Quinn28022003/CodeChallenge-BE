import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from 'src/modules/Users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		UsersModule,
		MongooseModule.forRoot(process.env.MONGODB_URI, {
			connectionFactory: connection => {
				connection.plugin(require('mongoose-delete'))
				return connection
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
