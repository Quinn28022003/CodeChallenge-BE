import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'
import { Challenge } from 'src/_challenge/models/Challenge.schema'
import { ChallengeServices } from 'src/_challenge/services/Challenge.services'
import ServerResponse from 'src/common/response/ServerResponse'

@Controller('challenge')
export class ChallengeController {
	constructor(private readonly challengeServices: ChallengeServices) {}

	@Get('/')
	async getNextPage(@Res() res: Response): Promise<Response<any, Record<string, any>>> {
		try {
			const data: Challenge[] = await this.challengeServices.getAll()
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: 500,
				message: 'Internal Server Error',
				error: error
			})
		}
	}

	// @Get('/paging')
	// async getNextPage(
	// 	@Query('page', ParseIntPipe) page: number,
	// 	@Query('ChallengePerPage', ParseIntPipe) challengePerPage: number
	// ) {}

	@Get(':id')
	async detail() {}

	@Post('')
	async create(@Body() body: CreateChallengeDto) {
		const reqBody: CreateChallengeDto = CreateChallengeDto.plainToClass(body)
		const response: Challenge = await this.challengeServices.create(reqBody)
	}

	@Post(':id')
	async update() {}

	@Delete(':id')
	async delete() {}
}
