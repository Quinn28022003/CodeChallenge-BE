import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { FilesService } from 'src/_files/Files.services'
import ServerResponse from 'src/common/response/ServerResponse'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('download')
	async downloadFile(@Res() res: Response, @Body() body: any) {
		try {
			const filePath = await this.filesService.getFilePath(body.path)
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
