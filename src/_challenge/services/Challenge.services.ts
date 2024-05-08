import { Injectable } from '@nestjs/common'
import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'
import { Challenge } from 'src/_challenge/models/Challenge.schema'

import { ChallengeRepository } from 'src/_challenge/repository/Challenge.repository'

@Injectable()
export class ChallengeServices {
	constructor(private readonly challengeRepository: ChallengeRepository) {}

	async getAll(): Promise<Challenge[]> {
		const data: Challenge[] = await this.challengeRepository.findAll()
		return data
	}

	async create(body: CreateChallengeDto): Promise<Challenge> {
		const data: Challenge = await this.challengeRepository.create(body)
		return data
	}

	async detail() {}
}
