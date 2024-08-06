import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import Mongoose from 'mongoose'

import { UsersRepository } from 'src/_users/Users.repository'
import { Users } from 'src/_users/Users.schema'
import { LINKS } from 'src/constants/links'
import { EMethods } from 'src/constants/request'
import { EFieldsUser } from 'src/constants/user'

@Injectable()
export class ValidateUniqueFieldsUserMdw implements NestMiddleware {
	constructor(private readonly usersRepository: UsersRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const validatedFields: string[] = []
		if (req.route.path === LINKS.USER && req.method === EMethods.POST) {
			validatedFields.push(EFieldsUser.CODECHANLLENGEID, EFieldsUser.EMAIL, EFieldsUser.PHONENUMBER)
		} else if (req.route.path === LINKS.USER_ID && req.method === EMethods.PUT) {
			if (!Mongoose.Types.ObjectId.isValid(req.params.id)) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST)

			if (Object.keys(req.body).length === 0) throw new HttpException('Request body is empty', HttpStatus.BAD_REQUEST)

			validatedFields.push(EFieldsUser.CODECHANLLENGEID, EFieldsUser.EMAIL, EFieldsUser.PHONENUMBER)
		}

		for (let i = 0; i < validatedFields.length; i++) {
			switch (validatedFields[i]) {
				case EFieldsUser.CODECHANLLENGEID: {
					const { codeChanllengeID } = req.body
					const existingUser: Users = await this.usersRepository.findOneByField(
						EFieldsUser.CODECHANLLENGEID,
						codeChanllengeID
					)
					if (existingUser) throw new HttpException('codeChanllengeID must be unique', HttpStatus.CONFLICT)
					break
				}
				case EFieldsUser.EMAIL: {
					const { email } = req.body
					const existingUser: Users = await this.usersRepository.findOneByField(EFieldsUser.EMAIL, email)
					if (existingUser) throw new HttpException('email must be unique', HttpStatus.CONFLICT)
					break
				}
				case EFieldsUser.PHONENUMBER: {
					const { phoneNumber } = req.body
					const existingUser: Users = await this.usersRepository.findOneByField(EFieldsUser.PHONENUMBER, phoneNumber)
					if (existingUser) throw new HttpException('phoneNumber must be unique', HttpStatus.CONFLICT)
					break
				}
			}
		}
		next()
	}
}
