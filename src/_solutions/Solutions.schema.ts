import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SolutionsDocument = HydratedDocument<Solutions>

@Schema({
	timestamps: true
})
export class Solutions {
	@Prop({ required: true })
	title: string

	@Prop({ required: true })
	description: string

	@Prop()
	watOne: string

	@Prop()
	wayTwo: string

	@Prop()
	note: string
}

const SolutionsSchema = SchemaFactory.createForClass(Solutions)

export default SolutionsSchema
