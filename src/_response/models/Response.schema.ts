import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type ResponseDocument = HydratedDocument<Response>

@Schema({
	timestamps: true
})
export class Response {
	@Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Users' } })
	sender: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	title: string

	@Prop({ required: true })
	comment: string

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

const ResponseSchema = SchemaFactory.createForClass(Response)

export default ResponseSchema
