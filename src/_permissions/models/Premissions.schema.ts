import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PremissionDocument = HydratedDocument<Premissions>

@Schema({
	timestamps: true
})
export class Premissions {
	@Prop({ required: true })
	url: string

	@Prop({ required: true })
	description: string

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The role array must have at least 1 item'
		},
		required: true
	})
	role: string[]
}

const PremissionsSchema = SchemaFactory.createForClass(Premissions)

export default PremissionsSchema
