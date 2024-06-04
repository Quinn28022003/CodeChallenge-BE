import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import MongooseDelete from 'mongoose-delete'

import { Status } from 'src/enums/Response'

export type ResponseDocument = Document & MongooseDelete.SoftDeleteDocument & Response

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
	title: string

	@Prop({ required: true })
	description: string

	@Prop({ enum: Status, default: Status.PENDING })
	status: Status

	@Prop({ required: true })
	pathFile: string[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const ResponseSchema = SchemaFactory.createForClass(Response)

export default ResponseSchema
