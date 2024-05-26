import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Difficulty } from 'src/enums/ChallengeType'
import { Case, Example } from 'src/interfaces/Challenge'

export type ChallengeDocument = HydratedDocument<Challenge>

@Schema({
	timestamps: true
})
export class Challenge {
	@Prop({ required: true })
	title: string

	@Prop({ enum: Difficulty, default: Difficulty.EASY })
	difficulty: Difficulty

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The topic array must have at least 1 item'
		},
		required: true
	})
	topic: string[]

	@Prop({ required: true })
	description: string

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The case array must have at least 1 item'
		},
		type: [Object],
		required: true
	})
	case: Case

	@Prop({ type: [Object], required: true })
	example: Example

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The restriction array must have at least 1 item'
		},
		required: true
	})
	restriction: string[]

	@Prop({ ref: 'comments' })
	comments: mongoose.Schema.Types.ObjectId[]

	@Prop({
		validate: {
			validator: (val: string[]) => val.length <= 1,
			message: 'The language array must have at least 1 item'
		},
		required: true
	})
	language: string[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Solutions' }] })
	Solutions: mongoose.Schema.Types.ObjectId[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const ChallengeSchema = SchemaFactory.createForClass(Challenge)

export default ChallengeSchema
