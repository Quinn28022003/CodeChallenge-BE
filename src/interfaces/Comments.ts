import mongoose from 'mongoose'

export interface RepliesChildren {
	_id: mongoose.Schema.Types.ObjectId
	Sender: mongoose.Schema.Types.ObjectId
	Content: string
	Heart: number
}
