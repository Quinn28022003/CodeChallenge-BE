import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { ResponseError, ResponseSuccess } from 'src/interfaces/Response'

class ServerResponse {
	static success(res: Response, { statusCode = HttpStatus.OK, message = 'success!', data = null }: ResponseSuccess) {
		return res.status(statusCode).json({
			message,
			data
		})
	}

	static error(res: Response, { statusCode = HttpStatus.BAD_REQUEST, message = 'error', error = null }: ResponseError) {
		return res.status(statusCode).json({
			message,
			error
		})
	}
}

export default ServerResponse
