import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

import { UserServices } from 'src/_users/services/Users.services'
import { IUsers } from 'src/interfaces/Users'

@Injectable()
export class ValidateUserUpdateMdw implements NestMiddleware {
	constructor(private readonly userServices: UserServices) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			const uploadPath: string = 'uploads/avatar/'
			if (req.files.length !== 0) {
				const data: IUsers = await this.userServices.findOneByField('_id', req.params.id)
				if (!data) {
					throw new BadRequestException(`Search for user but can't find it`)
				}

				fs.unlink(data.imagePath, err => {
					if (err) {
						console.error('Error deleting file:', err)
						return
					}
					console.log('File deleted successfully')
				})

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
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
