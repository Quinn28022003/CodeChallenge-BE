import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type ConnectionsDocument = HydratedDocument<Connections>

@Schema({
	timestamps: true
})
export class Connections {
	@Prop({ type: mongoose.Types.ObjectId })
	userId: mongoose.Schema.Types.ObjectId

	@Prop()
	useruuid: string

	@Prop({ required: true, unique: true })
	idSocketIo: string

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const ConnectionsSchema = SchemaFactory.createForClass(Connections)

export default ConnectionsSchema
