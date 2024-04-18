import { Body, Controller, Delete, Get, Post, Put, Res } from '@nestjs/common'
import { Response } from 'express'

import { UsersDto } from 'src/dto/Users.dto'
import { UserServices } from 'src/services/Users.services'

@Controller('users')
export class UsersController {
	constructor(private userServices: UserServices) {}

	@Get('')
	list(@Res() res: Response): Response {
		return res.send('hello my friends!')
	}

	@Post('')
	async create(@Res() res: Response, @Body() body: UsersDto): Promise<Response> {
		const userReal: UsersDto = UsersDto.plainToClass(body)

		// const data = await this.userServices.create(body)
		console.log(userReal)

		return res.status(200).json({
			data: {}
		})
	}

	@Put(':id')
	update(@Res() res: Response): Response {
		return res.send('updated')
	}

	@Delete(':id')
	delete(@Res() res: Response): Response {
		return res.send('deleted')
	}
}
