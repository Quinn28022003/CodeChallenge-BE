import { Body, Controller, HttpStatus, Param, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

import { ConfigService } from '@nestjs/config'
import { LoginDto } from 'src/_auth/dto/login.dto'
import { AuthServices } from 'src/_auth/services/auth.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ISignIn, IVerifyToken } from 'src/interfaces/auth'
import { encrypt } from 'src/utils/encrypt'

@Controller('auth')
export class AuthController {
	constructor(
		private authServices: AuthServices,
		private readonly configService: ConfigService
	) {}

	@Post('login')
	async signIn(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
		try {
			const data: ISignIn = await this.authServices.signIn(body.email, body.password)
			res.cookie('accessToken', data.token.access_token, { maxAge: 3600000 })
			const { refreshToken, password, ...userReal } = data.data
			return ServerResponse.success(res, {
				statusCode: HttpStatus.OK,
				message: 'Login success!',
				data: {
					userReal,
					isLoggedIn: data.isLoggedIn,
					token: data.token.access_token
				}
			})
		} catch (error) {
			console.log(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Post('verify/:id')
	async verifyToken(@Req() req: Request, @Res() res: Response, @Param('id') param: string): Promise<Response> {
		try {
			const accessToken: string = req.cookies['accessToken']
			const data: IVerifyToken = await this.authServices.verifyToken(accessToken, param)
			if (data.access_token) {
				res.cookie('accessToken', data.access_token, { maxAge: 3600000 })
			}

			const { ...userReal } = data.user
			const ciphertext: string = await encrypt(userReal, this.configService.get<string>('SECRET_DATA'))
			return ServerResponse.success(res, {
				statusCode: HttpStatus.OK,
				message: 'Token verification endpoint',
				data: {
					userReal: ciphertext,
					accessToken: data.access_token,
					isLoggedIn: data.isLoggedIn
				}
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'Invalid token',
				error
			})
		}
	}
}
