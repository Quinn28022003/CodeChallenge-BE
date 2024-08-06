import { Injectable } from '@nestjs/common'

@Injectable()
export class FilesService {
	async getFilePath(filename: string): Promise<string> {
		try {
			return `${filename}`
		} catch (error) {
			console.log('Error File services mehthod getFilePath')
			throw error
		}
	}
}
