import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import mongoose, { HydratedDocument } from 'mongoose'
import { Gender, Role } from 'src/enums/UserType'

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
	address: string

	@Prop({ required: true, unique: true })
	phoneNumber: string

	@Prop()
	technology: string[]

	@Prop()
	socialAccounts: string[]

	@Prop({ ref: 'challenges' })
	completedChallenges: mongoose.Types.ObjectId[]

	@Prop({ ref: 'notifications' })
	notifications: mongoose.Types.ObjectId[]

	@Prop({ ref: 'requests' })
	requests: mongoose.Types.ObjectId[]

	@Prop({ ref: 'responses' })
	responses: mongoose.Types.ObjectId[]

	@Prop({ ref: 'messages' })
	messages: mongoose.Types.ObjectId[]

	@Prop()
	studentRating: number[]

	@Prop()
	imagePath: string

	@Prop({ ref: 'users' })
	friends: mongoose.Types.ObjectId[]

	@Prop()
	refreshToken: string

	@Prop({ default: false })
	deleted: boolean

	@Prop()
	deletedAt: Date
}

const userSchema = SchemaFactory.createForClass(Users)

userSchema.methods.verifyPassword = async function (password: string) {
	return await bcrypt.compare(password, this.password)
}

userSchema.methods.toJSON = function () {
	const userObject = this.toObject()
	delete userObject.password
	delete userObject.refreshToken
	return userObject
}

userSchema.pre('save', async function () {
	this.password = await bcrypt.hash(this.password, 10)
})

export default userSchema
