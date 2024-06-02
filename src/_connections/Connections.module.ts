import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/_auth/auth.module'
import { ConnectionController } from 'src/_connections/controllers/Connection.controller'
import ConnectionsSchema from 'src/_connections/models/Connections.schema'
import { ConnectionsRepository } from 'src/_connections/repository/Connections.repository'
import { ConnectionsServices } from 'src/_connections/services/Connections.services'
import { MessageModule } from 'src/_message/Message.module'
import { UsersModule } from 'src/_users/Users.module'
import { Gateway } from 'src/gateway/Gateway'
import { MessageGateway } from 'src/gateway/Message.gateway'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'connections',
				schema: ConnectionsSchema
			}
		]),
		AuthModule,
		UsersModule,
		MessageModule
	],
	controllers: [ConnectionController],
	providers: [ConnectionsServices, ConnectionsRepository, Gateway, MessageGateway],
	exports: [ConnectionsServices]
})
export class ConnectionModule {}
