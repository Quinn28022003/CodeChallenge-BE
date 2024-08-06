import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type MessageDocument = HydratedDocument<Messages>

@Schema({
	timestamps: true
})
export class Messages {
	@Prop({ ref: 'users', required: true })
	sender: mongoose.Types.ObjectId

	@Prop({ ref: 'users', required: true })
	receiver: mongoose.Types.ObjectId

	@Prop({ required: true })
	content: string

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const MessageSchema = SchemaFactory.createForClass(Messages)

export default MessageSchema
