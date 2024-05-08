import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'
import { Challenge } from 'src/_challenge/models/Challenge.schema'
import { ChallengeServices } from 'src/_challenge/services/Challenge.services'

@Controller('challenge')
export class ChallengeController {
	constructor(private readonly challengeServices: ChallengeServices) {}

	@Get('/')
	async getNextPage(@Res() res: Response): Promise<Response> {
		const data: Challenge[] = await this.challengeServices.getAll()
		return res.status(200).json({
			data
		})
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
