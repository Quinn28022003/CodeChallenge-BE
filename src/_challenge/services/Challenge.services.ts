import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
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

	async findRefComment(idChallenge: mongoose.Types.ObjectId) {
		const data = await this.challengeRepository.findRefComment(idChallenge)
		return data
	}

	async findRefCommentLatest(idChallenge: mongoose.Types.ObjectId) {
		const data = await this.challengeRepository.findRefCommentLatest(idChallenge)
		return data
	}

	async getByFilter(
		language: string,
		topic: string,
		difficulty: string,
		latestChallenge: boolean
	): Promise<Challenge[]> {
		const data: Challenge[] = await this.challengeRepository.findByField(language, topic, difficulty, latestChallenge)
		return data
	}

	async getDetail(id: mongoose.Types.ObjectId): Promise<Challenge> {
		const data: Challenge = await this.challengeRepository.findOne(id)
		return data
	}

	async getQuantityByTopic(): Promise<string[]> {
		const data: string[] = await this.challengeRepository.findQuantityByField('topic')
		return data
	}

	async getQuantityByLanguage(): Promise<string[]> {
		const data: string[] = await this.challengeRepository.findQuantityByField('language')
		return data
	}

	async create(body: CreateChallengeDto): Promise<Challenge> {
		const data: Challenge = await this.challengeRepository.create(body)
		return data
	}

	async detail() {}
}
