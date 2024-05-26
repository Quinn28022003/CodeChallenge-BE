import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import { Status, Visibility } from 'src/enums/RequestType'

@Injectable()
export class ValiadateRequestUpdate implements NestMiddleware {
	async use(req: Request, res: Response, next: NextFunction) {
		for (const key in req.body) {
			switch (key) {
				case 'sender': {
					if (!mongoose.Types.ObjectId.isValid(req.body[key])) {
						throw new HttpException('Invalid ID format.', HttpStatus.BAD_REQUEST)
					}
					break
				}
				case 'receiver': {
					if (!mongoose.Types.ObjectId.isValid(req.body[key])) {
						throw new HttpException('Invalid ID format.', HttpStatus.BAD_REQUEST)
					}
					break
				}
				case 'status': {
					const isInEnum = Object.values(Status).includes(req.body[key])
					if (!isInEnum) {
						throw new HttpException('Status must be a valid enum value.', HttpStatus.BAD_REQUEST)
					}
					break
				}
				case 'visibility': {
					const isInEnum = Object.values(Visibility).includes(req.body[key])
					if (!isInEnum) {
						throw new HttpException('Visibility must be a valid enum value.', HttpStatus.BAD_REQUEST)
					}
					break
				}
			}
		}

		next()
	}
}
