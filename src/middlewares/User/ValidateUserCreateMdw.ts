import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

import { allowedImageExtensions } from 'src/constants/config'
import { EPathDefault } from 'src/constants/image'
import { LINKS } from 'src/constants/links'
import { EGender } from 'src/constants/user'

@Injectable()
export class ValidateUserCreateMdw implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction): Promise<void> {
		const uploadPath: string = LINKS.UPLOADS_AVATAR

		if (!req.files || req.files.length === 0) {
			switch (req.body.gender) {
				case EGender.FEMALE:
					req.body.imagePath = `${uploadPath}` + EPathDefault.FEMALEJPG
					break
				case EGender.MALE:
					req.body.imagePath = `${uploadPath}` + EPathDefault.MALEJPG
					break
				default:
					req.body.imagePath = `${uploadPath}` + EPathDefault.OTHERJPG
			}
		} else {
			const imageFile = req.files[0]
			const uniqueFileName: string = `${Date.now()}_${imageFile.originalname}`
			const imagePath: string = `${uploadPath}${uniqueFileName}`

			if (Number(req.files.length) > 1) throw new BadRequestException('Only one image file is allowed')

			const extname: string = path.extname(req.files[0].originalname).toLowerCase()
			if (!allowedImageExtensions.includes(extname)) throw new BadRequestException('Only image files are allowed')

			if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })

			fs.writeFile(imagePath, imageFile.buffer, err => {
				if (err) throw new HttpException('Unable to save photo', HttpStatus.INTERNAL_SERVER_ERROR)
			})

			req.body.imagePath = imagePath
		}

		next()
	}
}
