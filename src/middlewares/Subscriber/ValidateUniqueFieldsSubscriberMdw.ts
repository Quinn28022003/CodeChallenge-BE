import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { SubscriberRepository } from 'src/_subscriber/Subscriber.repository'

@Injectable()
export class ValidateUniqueFieldsSubscriberMdw implements NestMiddleware {
	constructor(private readonly subscriberRepository: SubscriberRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const existingUser = await this.subscriberRepository.findOne(req.body.email)
		if (existingUser) throw new HttpException('email must be unique', HttpStatus.CONFLICT)

		next()
	}
}
