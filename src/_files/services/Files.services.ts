import { Injectable } from '@nestjs/common'

@Injectable()
export class FilesService {
	async getFilePath(filename: string): Promise<string> {
		return `uploads/avatar/${filename}`
	}
}
