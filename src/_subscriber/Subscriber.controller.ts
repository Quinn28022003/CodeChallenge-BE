import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { SubscriberDto } from 'src/_subscriber/dto/Subscriber.dto'
import { Subscriber } from 'src/_subscriber/Subscriber.schema'
import { SubscriberServices } from 'src/_subscriber/Subscriber.services'

@Controller('subscriber')
export class SubscriberController {
	constructor(private readonly subscriberServices: SubscriberServices) {}

	@Post('')
	async subscriber(@Body() body: SubscriberDto, @Res() res: Response) {
		const data: Subscriber = await this.subscriberServices.create(body.email)
		res.status(HttpStatus.OK).json({
			data,
			errorCode: 0
		})
	}
}
