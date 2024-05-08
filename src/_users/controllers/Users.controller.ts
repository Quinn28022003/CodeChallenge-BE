import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'

import * as path from 'path'
import { CreateUsersDto } from 'src/_users/dto/CreateUsers.dto'
import { UpdateUsersDto } from 'src/_users/dto/UpdateUsers.dto'
import { Users } from 'src/_users/models/Users.schema'
import { UserServices } from 'src/_users/services/Users.services'

@Controller('users')
export class UsersController {
	constructor(private userServices: UserServices) {}

	@Get('')
	async list(@Res() res: Response): Promise<Response> {
		const data = await this.userServices.list()

		return res.status(200).json({
			data
		})
	}

	@Post('')
	async create(@Res() res: Response, @Body() body: CreateUsersDto): Promise<Response> {
		const userReal: CreateUsersDto = CreateUsersDto.plainToClass(body)

		const data: Users = await this.userServices.create(userReal)

		return res.status(200).json({
			data
		})
	}

	@Put(':id')
	async update(
		@Body() body: UpdateUsersDto,
		@Res() res: Response,
		@Param('id') param: mongoose.Types.ObjectId
	): Promise<Response> {
		const userReal: UpdateUsersDto = UpdateUsersDto.plainToClass(body)

		const data: any = await this.userServices.update(param, userReal)

		return res.status(200).json({ message: `PUT request to ${path}` })
	}

	@Delete(':id')
	delete(@Res() res: Response): Response {
		return res.send('deleted')
	}
}
