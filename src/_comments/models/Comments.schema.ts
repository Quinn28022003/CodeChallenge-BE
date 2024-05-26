import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

import { RepliesChildren } from 'src/interfaces/Comments'

export type CommentsDocument = HydratedDocument<Comments>

@Schema({
	timestamps: true
})
export class Comments {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', isRequired: true })
	idUser: mongoose.Schema.Types.ObjectId

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'challenge', isRequired: true })
	idChallenge: mongoose.Schema.Types.ObjectId

	@Prop({ required: true })
	content: string

	@Prop()
	heart: Number[]

	@Prop()
	replies: RepliesChildren[]

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const CommentsSchema = SchemaFactory.createForClass(Comments)

export default CommentsSchema
