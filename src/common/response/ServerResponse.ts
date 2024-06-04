import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { IResponseError, IResponseSuccess } from 'src/interfaces/Response'

class ServerResponse {
	static success(res: Response, { statusCode = HttpStatus.OK, message = 'success!', data = null }: IResponseSuccess) {
		return res.status(statusCode).json({
			message,
			data
		})
	}

	static error(
		res: Response,
		{ statusCode = HttpStatus.BAD_REQUEST, message = 'error', error = null }: IResponseError
	) {
		return res.status(statusCode).json({
			message,
			error
		})
	}
}

export default ServerResponse
