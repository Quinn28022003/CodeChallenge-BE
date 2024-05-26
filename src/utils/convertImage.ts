import { HttpException, HttpStatus } from '@nestjs/common'
import * as fs from 'fs'

export class ConvertImage {
	async toBase64(filePath: string): Promise<string> {
		try {
			const img = fs.readFileSync(filePath)
			return Buffer.from(img).toString('base64')
		} catch (error) {
			throw new HttpException(`Error converting image to base64: ${error}`, HttpStatus.BAD_REQUEST)
		}
	}
}
