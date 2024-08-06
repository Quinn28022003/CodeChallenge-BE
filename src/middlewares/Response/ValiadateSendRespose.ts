import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'

import { allowedExtensions } from 'src/constants/config'

@Injectable()
export class ValiadateSendRespose implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		if (req.files.length !== 0) {
			const pathFile: string[] = []
			if (req.files instanceof Array) {
				req.files.forEach((file: any) => {
					const fileName = file.originalname
					const lastDotIndex = fileName.lastIndexOf('.')
					const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : ''

					if (!allowedExtensions.includes(extension.toLowerCase()))
						throw new BadRequestException('Only image files, PDFs, and videos are allowed')
				})
			}
			if (req.files instanceof Array) {
				req.files.forEach((file: any) => {
					const fileName = file.originalname
					const lastDotIndex = fileName.lastIndexOf('.')
					const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : ''

					let path: string = ''
					let uploadPath: string = ''
					const uniqueFileName = `${Date.now()}_${fileName}`
					switch (extension) {
						case '.jpg':
							uploadPath = 'uploads/response/image/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.jpeg':
							uploadPath = 'uploads/response/image/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.png':
							uploadPath = 'uploads/response/image/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.tiff':
							uploadPath = 'uploads/response/image/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.doc':
							uploadPath = 'uploads/response/doc/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.docx':
							uploadPath = 'uploads/response/doc/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.pdf':
							uploadPath = 'uploads/response/pdf/'
							path = `${uploadPath}${uniqueFileName}`
							break
						case '.mp4':
							uploadPath = 'uploads/response/video/'
							path = `${uploadPath}${uniqueFileName}`
							break
					}
					req.body.point = Number(req.body.point)
					if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })
					fs.writeFile(path, file.buffer, err => {
						if (err) throw new HttpException('Unable to save photo', HttpStatus.INTERNAL_SERVER_ERROR)
					})
					pathFile.push(path)
				})
				req.body.pathFile = pathFile
			}
		}
		req.body.point = Number(req.body.point)
		next()
	}
}
