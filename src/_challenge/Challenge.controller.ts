import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import mongoose from 'mongoose'

import { Challenge } from 'src/_challenge/Challenge.schema'
import { ChallengeServices } from 'src/_challenge/Challenge.services'
import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'
import ServerResponse from 'src/common/response/ServerResponse'
import { ParseBooleanPipe } from 'src/common/validators/ParseBoolean.pipe'
import { ParseObjectIdPipe } from 'src/common/validators/ParseObjectId.pipe'
import { ParseStringPipe } from 'src/common/validators/ParseString.pipe'

@Controller('challenge')
export class ChallengeController {
	constructor(private readonly challengeServices: ChallengeServices) {}

	@Get('/')
	async getNextPage(@Res() res: Response): Promise<Response> {
		try {
			const data: Challenge[] = await this.challengeServices.getAll()
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Get('/filter')
	async getByFilter(
		@Res() res: Response,
		@Query('language', ParseStringPipe) language: string,
		@Query('topic', ParseStringPipe) topic: string,
		@Query('difficulty', ParseStringPipe) difficulty: string,
		@Query('latestChallenge', ParseBooleanPipe) latestChallenge: boolean
	): Promise<Response> {
		try {
			const data: Challenge[] = await this.challengeServices.getByFilter(language, topic, difficulty, latestChallenge)
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Get('quantity/topics')
	async getAllTopics(@Res() res: Response) {
		try {
			const data: string[] = await this.challengeServices.getQuantityByTopic()
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

	@Get('quantity/languages')
	async getAllLanguage(@Res() res: Response) {
		try {
			const data: string[] = await this.challengeServices.getQuantityByLanguage()
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
			const data: Challenge = await this.challengeServices.getDetail(param)
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

	@Get('/comment/:id')
	async getComment(@Res() res: Response, @Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId) {
		try {
			const data = await this.challengeServices.findRefComment(param)
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Get('/comment/:id')
	async getLatestChallengeComments(
		@Res() res: Response,
		@Param('id', ParseObjectIdPipe) param: mongoose.Types.ObjectId
	) {
		try {
			const data = await this.challengeServices.findRefComment(param)
			return ServerResponse.success(res, {
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Post('')
	async create(@Res() res: Response, @Body() body: CreateChallengeDto): Promise<Response> {
		try {
			const reqBody: CreateChallengeDto = CreateChallengeDto.plainToClass(body)
			const data: Challenge = await this.challengeServices.create(reqBody)
			return ServerResponse.success(res, {
				message: 'Create a successful challenge',
				data
			})
		} catch (error) {
			console.error(error)
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}

	@Put(':id')
	async update() {}

	@Delete(':id')
	async delete() {}
}
