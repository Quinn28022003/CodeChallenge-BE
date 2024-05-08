import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({
	timestamps: true
})
export class Notification {
	@Prop({ required: true })
	title: string

	@Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Users' } })
	sender: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	path: string

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const NotificationSchema = SchemaFactory.createForClass(Notification)

export default NotificationSchema
