import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Subscriber, subscriberDocument } from 'src/_subscriber/models/Subscriber.schema'

@Injectable()
export class SubscriberRepository {
	constructor(@InjectModel(Subscriber.name) private readonly subscriberModel: Model<subscriberDocument>) {}

	async create(email: string): Promise<Subscriber> {
		const data: Subscriber = await this.subscriberModel.create({ email })
		return data
	}

	async findOne(email: string): Promise<boolean> {
		const data: Subscriber = await this.subscriberModel.findOne({ email }).exec()
		if (data) {
			return true
		}

		return false
	}
}
