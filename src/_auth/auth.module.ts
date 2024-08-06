import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from 'src/_auth/auth.controller'
import { AuthServices } from 'src/_auth/auth.services'
import { UsersModule } from 'src/_users/Users.module'

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot(),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				global: true,
				secret: configService.get<string>('SECRET_ACCESS_TOKEN'),
				signOptions: { expiresIn: '1h' }
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthServices],
	exports: [AuthServices]
})
export class AuthModule {}
