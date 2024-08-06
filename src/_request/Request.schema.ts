import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'

import { Status, Visibility } from 'src/enums/RequestType'

export type RequestDocument = Document & MongooseDelete.SoftDeleteDocument & Request

@Schema({
	timestamps: true
})
export class Request {
	@Prop({ ref: 'users', isRequired: true })
	sender: mongoose.Types.ObjectId

	@Prop({ ref: 'users', isRequired: true })
	receiver: mongoose.Types.ObjectId

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	title: string

	@Prop({ required: true })
	description: string

	@Prop({ enum: Status, default: Status.PENDING })
	status: Status

	@Prop({ enum: Visibility, default: Visibility.PRIVATE })
	visibility: Visibility

	@Prop({ required: true })
	pathFile: string[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const RequestSchema = SchemaFactory.createForClass(Request)

RequestSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' })

export default RequestSchema
