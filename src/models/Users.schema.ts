import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
const bcrypt = require('bcryptjs')

import { Gender, Role } from 'src/enums/Type'

export type usersDocument = HydratedDocument<Users>

@Schema({
	timestamps: true
})
export class Users {
	@Prop({ required: true, unique: true })
	codeChanllengeID: string

	@Prop({ required: true })
	firstName: string

	@Prop({ required: true })
	lastName: string

	@Prop({ required: true, unique: true })
	email: string

	@Prop({ required: true })
	password: string

	@Prop({ enum: Role, default: Role.STUDENT })
	role: Role

	@Prop({ required: true })
	dateOfBirth: Date

	@Prop()
	description: string

	@Prop({ enum: Gender, default: Gender.OTHER })
	gender: Gender

	@Prop()
	adress: string

	@Prop()
	technology: string[]

	@Prop()
	socialAccounts: string[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'challenge' }] })
	completedChallenges: mongoose.Schema.Types.ObjectId[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'notifications' }] })
	notifications: mongoose.Schema.Types.ObjectId[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'request' }] })
	request: mongoose.Schema.Types.ObjectId[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'response' }] })
	response: mongoose.Schema.Types.ObjectId[]

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'message' }] })
	message: mongoose.Schema.Types.ObjectId[]

	@Prop()
	rate: number

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const userSchema = SchemaFactory.createForClass(Users)

userSchema.methods.fullName = function () {
	return `${this.firstName} ${this.lastName}`
}

userSchema.methods.verifyPassword = async function (password: string) {
	return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function () {
	this.password = await bcrypt.hash(this.password, 10)
})

export default userSchema
