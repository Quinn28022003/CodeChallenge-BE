import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from 'src/_auth/controller/auth.controller'
import { AuthServices } from 'src/_auth/services/auth.services'
import { UsersModule } from 'src/_users/Users.module'

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot(),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('SECRET_ACCESS_TOKEN'),
				signOptions: { expiresIn: '10s' }
			})
		})
	],
	providers: [AuthServices],
	controllers: [AuthController]
})
export class AuthModule {}
