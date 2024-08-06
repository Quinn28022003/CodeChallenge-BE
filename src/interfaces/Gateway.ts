import mongoose from 'mongoose'

export interface IReview {
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	description: string
	rating: number
	idResponse: mongoose.Types.ObjectId
}
