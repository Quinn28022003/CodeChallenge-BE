export interface ResponseSuccess {
	statusCode?: number
	message?: string
	data?: any
}

export interface ResponseError {
	statusCode?: number
	message?: string
	error: any
}
