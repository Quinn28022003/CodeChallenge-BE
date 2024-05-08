import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import Mongoose from 'mongoose'
import * as path from 'path'

import { UsersRepository } from 'src/_users/repository/Users.repository'

@Injectable()
export class ValidateUniqueFieldsUserMdw implements NestMiddleware {
	constructor(private readonly usersRepository: UsersRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const validatedFields: string[] = []
		if (req.route.path === `/users` && req.method === 'POST') {
			const uploadPath: string = 'uploads/avatar/'

			if (!req.files || req.files.length === 0) {
				switch (req.body.gender) {
					case 'female': {
						req.body.imagePath = `${uploadPath}` + 'female.jpg'
						break
					}

					case 'male': {
						req.body.imagePath = `${uploadPath}` + 'male.jpg'
						break
					}

					default: {
						req.body.imagePath = `${uploadPath}` + 'other.jpg'
					}
				}
			} else {
				const imageFile = req.files[0]
				const uniqueFileName = `${Date.now()}_${imageFile.originalname}`
				const imagePath = `${uploadPath}${uniqueFileName}`

				if (Number(req.files.length) > 1) {
					throw new BadRequestException('Only one image file is allowed')
				}

				const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
				const extname = path.extname(req.files[0].originalname).toLowerCase()
				if (!allowedImageExtensions.includes(extname)) {
					throw new BadRequestException('Only image files are allowed')
				}

				if (!fs.existsSync(uploadPath)) {
					fs.mkdirSync(uploadPath, { recursive: true })
				}

				fs.writeFile(imagePath, imageFile.buffer, err => {
					if (err) {
						throw new HttpException('Unable to save photo', HttpStatus.INTERNAL_SERVER_ERROR)
					}
				})

				req.body.imagePath = imagePath
			}

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
					const existingUser = await this.usersRepository.findOneById('codeChanllengeID', codeChanllengeID)
					if (existingUser) {
						throw new HttpException('codeChanllengeID must be unique', HttpStatus.CONFLICT)
					}
					break
				}

				case 'email': {
					const { email } = req.body
					const existingUser = await this.usersRepository.findOneById('email', email)
					if (existingUser) {
						throw new HttpException('email must be unique', HttpStatus.CONFLICT)
					}
					break
				}

				case 'phoneNumber': {
					const { phoneNumber } = req.body
					const existingUser = await this.usersRepository.findOneById('phoneNumber', phoneNumber)
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
