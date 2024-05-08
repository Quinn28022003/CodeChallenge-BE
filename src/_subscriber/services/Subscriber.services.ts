import { Injectable } from '@nestjs/common'
import { Subscriber } from 'src/_subscriber/models/Subscriber.schema'
import { SubscriberRepository } from 'src/_subscriber/repository/Subscriber.repository'

@Injectable()
export class SubscriberServices {
	constructor(private subscriberRepository: SubscriberRepository) {}
	async create(email: string): Promise<Subscriber> {
		const data: Subscriber = await this.subscriberRepository.create(email)
		return data
	}
}
