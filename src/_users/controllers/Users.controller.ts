import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import mongoose from 'mongoose'

import { UserCreateDto } from 'src/_users/dto/UserCreate.dto'
import { UserUpdateDto } from 'src/_users/dto/UserUpdate.dto'
import { UserServices } from 'src/_users/services/Users.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/parseObjectId.pipe'
import { IUsers, IUsersConvert } from 'src/interfaces/Users'
import { encrypt } from 'src/utils/encrypt'

@Controller('users')
export class UsersController {
	constructor(
		private userServices: UserServices,
		private readonly configService: ConfigService
	) {}

	@Get('')
	async list(@Res() res: Response): Promise<Response> {
		try {
			const data = await this.userServices.list()

			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Get(':id')
	async detail(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.userServices.findOneDetail(param)

			const ciphertext: string = await encrypt(data, this.configService.get<string>('SECRET_DATA'))
			return ServerResponse.success(res, {
				data: ciphertext
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}
	@Get('friends/:id')
	async findFriends(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data: IUsersConvert[] = await this.userServices.findFriends(param)

			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Post('')
	async create(@Res() res: Response, @Body() body: UserCreateDto): Promise<Response> {
		try {
			const userReal: UserCreateDto = UserCreateDto.plainToClass(body)

			const data: IUsers = await this.userServices.create(userReal)

			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Put(':id')
	async update(
		@Body() body: UserUpdateDto,
		@Res() res: Response,
		@Param('id') param: mongoose.Types.ObjectId
	): Promise<Response> {
		try {
			const userReal: UserUpdateDto = UserUpdateDto.plainToClass(body)

			const data: any = await this.userServices.update(param, userReal)

			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Delete(':id')
	delete(@Res() res: Response): Response {
		return res.send('deleted')
	}
}
