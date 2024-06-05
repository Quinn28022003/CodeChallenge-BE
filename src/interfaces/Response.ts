import mongoose from 'mongoose'
import { Status } from 'src/enums/RequestType'

export interface IResponseSuccess {
	statusCode?: number
	message?: string
	data?: any
}

export interface IResponseError {
	statusCode?: number
	message?: string
	error: any
}

export interface IcreateResponse {
	title: string
	name: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	description?: string
	files?: any
	idRequest: mongoose.Types.ObjectId
	status: Status
}
