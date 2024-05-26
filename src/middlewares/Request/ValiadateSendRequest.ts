import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'

@Injectable()
export class ValiadateSendRequest implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		if (req.files.length === 0) {
			throw new HttpException('Must transmit at least 1 file', HttpStatus.INTERNAL_SERVER_ERROR)
		}
		const pathFile: string[] = []
		if (req.files instanceof Array) {
			req.files.forEach((file: any) => {
				const fileName = file.originalname
				const lastDotIndex = fileName.lastIndexOf('.')
				const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : ''

				const allowedExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.mp4']
				if (!allowedExtensions.includes(extension.toLowerCase())) {
					throw new BadRequestException('Only image files, PDFs, and videos are allowed')
				}
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
					case '.jpg': {
						uploadPath = 'uploads/request/image/'
						path = `${uploadPath}${uniqueFileName}`
						break
					}
					case '.jpeg': {
						uploadPath = 'uploads/request/image/'
						path = `${uploadPath}image/${uniqueFileName}`
						break
					}
					case '.png': {
						uploadPath = 'uploads/request/image/'
						path = `${uploadPath}image/${uniqueFileName}`
						break
					}
					case '.doc': {
						uploadPath = 'uploads/request/doc/'
						path = `${uploadPath}${uniqueFileName}`
						break
					}
					case '.docx': {
						uploadPath = 'uploads/request/docx/'
						path = `${uploadPath}${uniqueFileName}`
						break
					}
					case '.pdf': {
						uploadPath = 'uploads/request/pdf/'
						path = `${uploadPath}${uniqueFileName}`
						break
					}
					case '.mp4': {
						uploadPath = 'uploads/request/video/'
						path = `${uploadPath}${uniqueFileName}`
						break
					}
				}

				if (!fs.existsSync(uploadPath)) {
					fs.mkdirSync(uploadPath, { recursive: true })
				}

				fs.writeFile(path, file.buffer, err => {
					if (err) {
						throw new HttpException('Unable to save photo', HttpStatus.INTERNAL_SERVER_ERROR)
					}
				})

				pathFile.push(path)
			})

			req.body.pathFile = pathFile
		}
		next()
	}
}
