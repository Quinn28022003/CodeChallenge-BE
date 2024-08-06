import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Challenge } from 'src/_challenge/Challenge.schema'
import { CreateChallengeDto } from 'src/_challenge/dto/CreateChallenge.dto'

@Injectable()
export class ChallengeRepository {
	constructor(@InjectModel('challenges') private readonly challengeModel: Model<Challenge>) {}
	async findAll(): Promise<Challenge[]> {
		const data: Challenge[] = await this.challengeModel.find()
		return data
	}

	async findRefComment(idChallenge: mongoose.Types.ObjectId) {
		const data = await this.challengeModel.findById(idChallenge).populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } }
		})
		return data
	}

	async findRefCommentLatest(idChallenge: mongoose.Types.ObjectId) {
		const data = await this.challengeModel.findById(idChallenge).populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } }
		})
		return data
	}

	async findByField(
		language: string,
		topic: string,
		difficulty: string,
		latestChallenge?: boolean
	): Promise<Challenge[]> {
		let query: any = {}

		if (language) {
			query.language = language
		}

		if (topic) {
			query.topic = topic
		}

		if (difficulty) {
			query.difficulty = difficulty
		}

		let data: Challenge[]

		if (latestChallenge === true) {
			data = await this.challengeModel.find(query).sort({ createdAt: -1 })
		} else if (latestChallenge === false) {
			data = await this.challengeModel.find(query).sort({ createdAt: 1 })
		} else {
			data = await this.challengeModel.find(query)
		}

		return data
	}

	async findOne(id: mongoose.Types.ObjectId): Promise<Challenge> {
		const data: Challenge = await this.challengeModel.findOne({ _id: id })
		return data
	}

	async findQuantityByField(field: string): Promise<string[]> {
		const data = await this.challengeModel.aggregate([
			{ $unwind: `$${field}` },
			{ $group: { _id: `$${field}`, count: { $sum: 1 } } },
			{ $project: { _id: 0, title: '$_id', count: 1 } }
		])
		return data
	}

	async create(body: CreateChallengeDto): Promise<Challenge> {
		const data: Challenge = await this.challengeModel.create(body)
		return data
	}
}
