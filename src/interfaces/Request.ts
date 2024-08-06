import mongoose from 'mongoose'

import { Status, Visibility } from 'src/enums/RequestType'
import { IUsersConvert } from 'src/interfaces/Users'

export interface IRequest {
	_id?: mongoose.Types.ObjectId
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	name: string
	title: string
	description: string
	status: Status
	visibility: Visibility
	pathFile: string[]
	deleted: boolean
	deletedAt: Date
	createdAt?: Date
}

export interface IRequestConvert {
	_id?: mongoose.Types.ObjectId
	sender: IUsersConvert
	receiver: mongoose.Types.ObjectId
	name: string
	title: string
	description: string
	status: Status
	visibility: Visibility
	pathFile: string[]
	deleted: boolean
	deletedAt: Date
	createdAt: string
}

export interface IcreateRequest {
	name: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	description: string
	idRequest: mongoose.Types.ObjectId
}

export interface IRequestGetByFieldDto {
	_id?: mongoose.Types.ObjectId
	sender?: mongoose.Types.ObjectId
	receiver?: mongoose.Types.ObjectId
	name?: string
	title?: string
	description?: string
	status?: Status
	visibility?: Visibility
	deleted?: boolean
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export interface IRequestLatest {
	sender: IUsersConvert
	createdAt?: Date
}
