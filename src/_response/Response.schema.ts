import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'

export type ResponseDocument = Document & MongooseDelete.SoftDeleteDocument & Response

@Schema({
	timestamps: true
})
export class Response {
	@Prop({ ref: 'users' })
	sender: mongoose.Types.ObjectId

	@Prop({ ref: 'users' })
	receiver: mongoose.Types.ObjectId

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	description: string

	@Prop({ required: true })
	point: number

	@Prop()
	pathFile: string[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const ResponseSchema = SchemaFactory.createForClass(Response)

ResponseSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' })

export default ResponseSchema
