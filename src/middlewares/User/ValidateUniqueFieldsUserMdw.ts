import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import Mongoose from 'mongoose'

import { UsersRepository } from 'src/_users/repository/Users.repository'

@Injectable()
export class ValidateUniqueFieldsUserMdw implements NestMiddleware {
	constructor(private readonly usersRepository: UsersRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const validatedFields: string[] = []
		if (req.route.path === `/users` && req.method === 'POST') {
			validatedFields.push('codeChanllengeID', 'email', 'phoneNumber')
		} else if (req.route.path === `/users/:id` && req.method === 'PUT') {
			if (!Mongoose.Types.ObjectId.isValid(req.params.id)) {
				throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST)
			}

			if (Object.keys(req.body).length === 0) {
				throw new HttpException('Request body is empty', HttpStatus.BAD_REQUEST)
			}

			validatedFields.push('codeChanllengeID', 'email', 'phoneNumber')
		}

		for (let i = 0; i < validatedFields.length; i++) {
			switch (validatedFields[i]) {
				case 'codeChanllengeID': {
					const { codeChanllengeID } = req.body
					const existingUser = await this.usersRepository.findOneByField('codeChanllengeID', codeChanllengeID)
					if (existingUser) {
						throw new HttpException('codeChanllengeID must be unique', HttpStatus.CONFLICT)
					}
					break
				}

				case 'email': {
					const { email } = req.body
					const existingUser = await this.usersRepository.findOneByField('email', email)
					if (existingUser) {
						throw new HttpException('email must be unique', HttpStatus.CONFLICT)
					}
					break
				}

				case 'phoneNumber': {
					const { phoneNumber } = req.body
					const existingUser = await this.usersRepository.findOneByField('phoneNumber', phoneNumber)
					if (existingUser) {
						throw new HttpException('phoneNumber must be unique', HttpStatus.CONFLICT)
					}
					break
				}
			}
		}
		next()
	}
}
