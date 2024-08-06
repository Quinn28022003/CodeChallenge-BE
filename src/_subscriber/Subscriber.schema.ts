import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type subscriberDocument = HydratedDocument<Subscriber>

@Schema({
	timestamps: true
})
export class Subscriber {
	@Prop({ required: true, unique: true })
	email: string

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const SubscriberSchema = SchemaFactory.createForClass(Subscriber)

export default SubscriberSchema
