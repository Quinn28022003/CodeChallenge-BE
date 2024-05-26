import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { UsersRepository } from 'src/_users/repository/Users.repository'

@Injectable()
export class ValidateUserGetByFieldMdw implements NestMiddleware {
	constructor(private readonly usersRepository: UsersRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
		next()
	}
}
