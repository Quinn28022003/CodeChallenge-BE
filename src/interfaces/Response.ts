import mongoose from 'mongoose'
import { Status } from 'src/enums/RequestType'
import { IUsersConvert } from 'src/interfaces/Users'

export interface IResponse {
	_id?: mongoose.Types.ObjectId
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	name: string
	description: string
	pathFile: string[]
	point: number
	deleted: boolean
	deletedAt: Date
	createdAt?: Date
}

export interface IResponseConvert {
	_id?: mongoose.Types.ObjectId
	sender: IUsersConvert
	receiver: mongoose.Types.ObjectId
	name: string
	description: string
	pathFile: string[]
	point: number
	deleted: boolean
	deletedAt: Date
	createdAt?: string
}

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

export interface ICreateResponse {
	name: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	description: string
	idRequest?: mongoose.Types.ObjectId
	idResponse?: mongoose.Types.ObjectId
	status: Status
}
