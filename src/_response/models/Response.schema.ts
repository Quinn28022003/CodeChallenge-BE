import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type ResponseDocument = HydratedDocument<Response>

@Schema({
	timestamps: true
})
export class Response {
	@Prop({ ref: 'users' })
	sender: mongoose.Schema.Types.ObjectId

	@Prop({ ref: 'users' })
	receiver: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	description: string

	@Prop({ required: true })
	pathFile: string[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const ResponseSchema = SchemaFactory.createForClass(Response)

export default ResponseSchema
