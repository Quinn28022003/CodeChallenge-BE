import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

import { UsersRepository } from 'src/_users/repository/Users.repository'

@Injectable()
export class ValidateUserCreateMdw implements NestMiddleware {
	constructor(private readonly usersRepository: UsersRepository) {}

	async use(req: Request, res: Response, next: NextFunction) {
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

		next()
	}
}
