import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import mongoose from 'mongoose'

import { UserCreateDto } from 'src/_users/dto/UserCreate.dto'
import { UserGetFieldDto } from 'src/_users/dto/UserGetByField.dto'
import { UserGetByFieldSort } from 'src/_users/dto/UserGetByFieldSort.dto'
import { UserUpdateDto } from 'src/_users/dto/UserUpdate.dto'
import { Users } from 'src/_users/Users.schema'
import { UserServices } from 'src/_users/Users.services'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseObjectIdPipe } from 'src/common/validators/ParseObjectId.pipe'
import { Sort } from 'src/enums/UserType'
import { IUsers, IUsersConvert } from 'src/interfaces/Users'
import { encrypt } from 'src/utils/Encrypt'

@Controller('users')
export class UsersController {
	constructor(
		private userServices: UserServices,
		private readonly configService: ConfigService
	) {}

	@Get('')
	async list(@Res() res: Response): Promise<Response> {
		try {
			const data: IUsersConvert[] = await this.userServices.list()

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

	@Get('sort')
	async findBySort(@Res() res: Response, @Query() body: UserGetByFieldSort): Promise<Response> {
		try {
			if (String(body.sort) === 'ASC') {
				const data: IUsersConvert[] = await this.userServices.findBySort(body.field, Sort.ASC, body.limit ?? null)
				return ServerResponse.success(res, {
					data
				})
			}
			const data: IUsersConvert[] = await this.userServices.findBySort(body.field, Sort.DESC, body.limit ?? null)
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

	@Get('quantity/byField')
	async listByField(@Res() res: Response, @Query() body: UserGetFieldDto): Promise<Response> {
		try {
			const data: number = await this.userServices.findQuantityByField(body)

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

	@Get('quantity')
	async findTotalUsers(@Res() res: Response) {
		try {
			const data: number = await this.userServices.findTotalUsers()

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

	@Get('quantity/online')
	async findOnline(@Res() res: Response, @Query() body: UserGetFieldDto) {
		try {
			const data: number = await this.userServices.findQuantityByField(body)
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

	@Get('quantity/offline')
	async findOffline(@Res() res: Response, @Query() body: UserGetFieldDto) {
		try {
			const data: number = await this.userServices.findQuantityByField(body)
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
		@Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId
	): Promise<Response> {
		try {
			const data: Users = await this.userServices.update(param, body)

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
