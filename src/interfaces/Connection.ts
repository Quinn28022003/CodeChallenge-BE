import mongoose from 'mongoose'

export interface ConnectionCreate {
	userId: mongoose.Types.ObjectId
	useruuid: string
	idSocketIo: string
}
