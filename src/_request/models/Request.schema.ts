import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Status } from 'src/enums/Type'

export type RequestDocument = HydratedDocument<Request>

@Schema({
	timestamps: true
})
export class Request {
	@Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Users' } })
	sender: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	title: string

	@Prop({ required: true })
	description: string

	@Prop({ enum: Status, default: Status.PRIVATE })
	status: Status

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The PathFile array must have at least 1 item'
		},
		required: true
	})
	PathFile: string[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const RequestSchema = SchemaFactory.createForClass(Request)

export default RequestSchema
