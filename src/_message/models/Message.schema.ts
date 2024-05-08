import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { MessageStatus } from 'src/enums/Type'

export type MessageDocument = HydratedDocument<Message>

@Schema({
	timestamps: true
})
export class Message {
	@Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Users' } })
	sender: mongoose.Schema.Types.ObjectId

	@Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Users' } })
	recipient: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	content: string

	@Prop({ required: true, default: Date.now })
	Timestamp: Date

	@Prop({ required: true })
	status: MessageStatus

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const MessageSchema = SchemaFactory.createForClass(Message)

export default MessageSchema
