import mongoose from 'mongoose'

export interface ISubscriberData {
	email: string
	deleted: boolean
	_id: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface ICreateNotificationBody {
	title: string
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	path: string
}
