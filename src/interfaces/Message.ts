import mongoose from 'mongoose'

export interface IMessage {
	_id?: mongoose.Types.ObjectId
	sender?: mongoose.Types.ObjectId
	receiver?: mongoose.Types.ObjectId
	content?: string
	time?: string
	createdAt?: string
}

export interface IMessageCreate {
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	content: string
}
