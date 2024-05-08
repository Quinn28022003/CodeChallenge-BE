import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'
import { Challenge } from 'src/_challenge/models/Challenge.schema'

@Injectable()
export class ChallengeRepository {
	constructor(@InjectModel(Challenge.name) private readonly challengeModel: Model<Challenge>) {}
	async findAll(): Promise<Challenge[]> {
		const data: Challenge[] = await this.challengeModel.find()
		return data
	}

	async create(body: CreateChallengeDto): Promise<Challenge> {
		const data: Challenge = await this.challengeModel.create(body)
		return data
	}
}
