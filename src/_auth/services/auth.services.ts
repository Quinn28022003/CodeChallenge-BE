import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { UserServices } from 'src/_users/services/Users.services'
import { IfindAll } from 'src/interfaces/Users'
import { IPayloadGenerateToke } from 'src/interfaces/auth'

@Injectable()
export class AuthServices {
	constructor(
		private usersService: UserServices,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async signIn(
		email: string,
		password: string
	): Promise<{
		data: IfindAll
		token: {
			access_token: string
			refresh_token: string
		}
		isLoggedIn: boolean
	}> {
		const checkEmail: boolean = await this.usersService.checkEmail(email)

		if (!checkEmail) {
			throw new HttpException('Email or password is incorrect?', HttpStatus.CONFLICT)
		}

		const checkPassWord: IfindAll = await this.usersService.checkPassword(email, password)

		if (!checkPassWord) {
			throw new HttpException('Email or password is incorrect?', HttpStatus.CONFLICT)
		}

		const payload: IPayloadGenerateToke = {
			id: checkPassWord._id.toString(),
			email: checkPassWord.email,
			role: checkPassWord.role,
			isLoggedIn: true
		}

		const token = await this.generateToke(payload)
		await this.usersService.updateRefreshToken(checkPassWord._id, token.refresh_token)

		return {
			data: checkPassWord,
			token,
			isLoggedIn: true
		}
	}

	async generateToke(payload: IPayloadGenerateToke) {
		const access_token: string = await this.jwtService.signAsync(payload)
		const refresh_token: string = await this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
			expiresIn: '7d'
		})

		return {
			access_token,
			refresh_token
		}
	}

	async verifyToken(
		token: string,
		userId: string
	): Promise<{ user: IfindAll; access_token?: string; isLoggedIn: boolean }> {
		try {
			if (!token) {
				throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED)
			}

			const payload: IPayloadGenerateToke = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('SECRET_ACCESS_TOKEN')
			})

			const user: IfindAll = await this.usersService.detail('_id', userId)

			return { user, isLoggedIn: true }
		} catch (error) {
			if (error.message) {
				const user: IfindAll = await this.usersService.detail('_id', userId)

				const data = await this.refreshToken(user.refreshToken)
				return { user, access_token: data.access_token, isLoggedIn: true }
			} else {
				throw new HttpException(
					'The access token is invalid or expired. Attempting to refresh...',
					HttpStatus.UNAUTHORIZED
				)
			}
		}
	}

	async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
		try {
			const payload: IPayloadGenerateToke = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.configService.get<string>('SECRET_REFRESH_TOKEN')
			})

			const payloadOld: IPayloadGenerateToke = {
				id: payload.id,
				email: payload.email,
				role: payload.email,
				isLoggedIn: payload.isLoggedIn
			}

			const newAccessToken: string = await this.jwtService.signAsync(payloadOld, {
				secret: this.configService.get<string>('SECRET_ACCESS_TOKEN'),
				expiresIn: '10s'
			})

			return { access_token: newAccessToken }
		} catch (error) {
			throw new HttpException('The refresh token is invalid or expired. Please log in again.', HttpStatus.UNAUTHORIZED)
		}
	}
}
