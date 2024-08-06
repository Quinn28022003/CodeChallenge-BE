import { Injectable } from '@nestjs/common'
import { SubscriberRepository } from 'src/_subscriber/Subscriber.repository'
import { Subscriber } from 'src/_subscriber/Subscriber.schema'

@Injectable()
export class SubscriberServices {
	constructor(private subscriberRepository: SubscriberRepository) {}
	async create(email: string): Promise<Subscriber> {
		const data: Subscriber = await this.subscriberRepository.create(email)
		return data
	}
}
