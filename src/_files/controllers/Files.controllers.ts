import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { Response } from 'express'
import { FilesService } from 'src/_files/services/Files.services'
import ServerResponse from 'src/common/response/ServerResponse'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('download')
	async downloadFile(@Res() res: Response) {
		try {
			const filename = '1715321931067_404_not_found.jpg'
			const filePath = await this.filesService.getFilePath(filename)
			res.download(filePath)
		} catch (error) {
			return ServerResponse.error(res, {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal Server Error',
				error
			})
		}
	}
}
