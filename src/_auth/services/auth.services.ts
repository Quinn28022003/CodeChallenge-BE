import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import mongoose from 'mongoose'

import { UserServices } from 'src/_users/services/Users.services'
import { IUsers, IUsersConvert } from 'src/interfaces/Users'
import { IGenerateToke, IPayloadGenerateToke, IRefreshToken, ISignIn, IVerifyToken } from 'src/interfaces/auth'

@Injectable()
export class AuthServices {
	constructor(
		private usersService: UserServices,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async signIn(email: string, UserPassword: string): Promise<ISignIn> {
		try {
			const checkEmail: boolean = await this.usersService.checkEmail(email)
			if (!checkEmail) {
				throw new HttpException('Email or password is incorrect?', HttpStatus.CONFLICT)
			}
			const checkPassWord: IUsers = await this.usersService.checkPassword(email, UserPassword)

			if (!checkPassWord) {
				throw new HttpException('Email or password is incorrect?', HttpStatus.CONFLICT)
			}

			const payload: IPayloadGenerateToke = {
				id: checkPassWord._id.toString(),
				email: checkPassWord.email,
				role: checkPassWord.role,
				isLoggedIn: true
			}
			const token: IGenerateToke = await this.generateToke(payload)
			await this.usersService.updateRefreshToken(checkPassWord._id, token.refresh_token)
			return {
				data: checkPassWord,
				token,
				isLoggedIn: true
			}
		} catch (e) {
			console.log('Error method signIn: ', e)
			throw e
		}
	}

	async generateToke(payload: IPayloadGenerateToke) {
		try {
			const access_token: string = await this.jwtService.signAsync(payload)
			const refresh_token: string = await this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
				expiresIn: '7d'
			})

			return {
				access_token,
				refresh_token
			}
		} catch (e) {
			console.log('Error method generateToke: ', e)
			throw e
		}
	}

	async verifyToken(token: string, userId: string): Promise<IVerifyToken> {
		try {
			if (!token) {
				throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED)
			}
			await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('SECRET_ACCESS_TOKEN')
			})

			const user: IUsersConvert = await this.usersService.findOneDetail(new mongoose.Types.ObjectId(userId))

			return { user, isLoggedIn: true }
		} catch (error) {
			console.log('Error method verifyToken: ', error)
			if (error.message) {
				const container: IUsers = await this.usersService.findOneByField('_id', new mongoose.Types.ObjectId(userId))
				const data = await this.refreshToken(container.refreshToken)
				const user: IUsersConvert = await this.usersService.findOneDetail(container._id)
				return { user, access_token: data.access_token, isLoggedIn: true }
			} else {
				throw new HttpException(
					'The access token is invalid or expired. Attempting to refresh...',
					HttpStatus.UNAUTHORIZED
				)
			}
		}
	}

	async refreshToken(refreshToken: string): Promise<IRefreshToken> {
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
				expiresIn: '1h'
			})

			return { access_token: newAccessToken }
		} catch (error) {
			throw new HttpException('The refresh token is invalid or expired. Please log in again.', HttpStatus.UNAUTHORIZED)
		}
	}
}
