import mongoose from 'mongoose'

export interface INotification {
	_id?: mongoose.Types.ObjectId
	title: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	idRequest: mongoose.Types.ObjectId
	path: string
	deleted: boolean
	deletedAt: Date
	createdAt?: Date
}

export interface INotificationConvert {
	_id?: mongoose.Types.ObjectId
	title: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	idRequest?: mongoose.Types.ObjectId
	path: string
	deleted: boolean
	deletedAt: Date
	createdAt?: Date
}
