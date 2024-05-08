import { Body, Controller, HttpStatus, Param, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { LoginDto } from 'src/_auth/dto/login.dto'
import { AuthServices } from 'src/_auth/services/auth.services'
import { IfindAll } from 'src/interfaces/Users'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthServices) {}

	@Post('login')
	async signIn(@Body() body: LoginDto, @Res() res: Response) {
		const data: {
			data: IfindAll
			token: {
				access_token: string
				refresh_token: string
			}
			isLoggedIn: boolean
		} = await this.authService.signIn(body.email, body.password)

		res.cookie('accessToken', data.token.access_token, { maxAge: 3600000 })

		const { refreshToken, password, ...userReal } = data.data

		return res.status(HttpStatus.OK).json({
			userReal,
			isLoggedIn: data.isLoggedIn
		})
	}

	@Post('verify/:id')
	async verifyToken(@Req() req: Request, @Res() res: Response, @Param('id') param: string) {
		const accessToken: string = req.cookies['accessToken']

		try {
			const data: { user: IfindAll; access_token?: string; isLoggedIn: boolean } = await this.authService.verifyToken(
				accessToken,
				param
			)

			if (data.access_token) {
				res.cookie('accessToken', data.access_token, { maxAge: 3600000 })
			}

			const { refreshToken, password, ...user } = data.user
			return res.status(HttpStatus.OK).json({
				message: 'Token verification endpoint',
				user,
				accessToken: data.access_token,
				isLoggedIn: data.isLoggedIn
			})
		} catch (error) {
			return res.status(HttpStatus.UNAUTHORIZED).json({
				message: 'Invalid token'
			})
		}
	}
}
