import mongoose from 'mongoose'
import { Gender, Role } from 'src/enums/UserType'
import { INotification } from 'src/interfaces/Notification'

export interface IUsersConvert {
	_id?: mongoose.Types.ObjectId
	codeChanllengeID: string
	fullName: string
	email: string
	role: Role
	dateOfBirth: string
	description?: string
	gender: Gender
	address: string
	technology?: string
	socialAccounts?: string[]
	completedChallenges?: mongoose.Types.ObjectId[]
	notifications?: mongoose.Types.ObjectId[] | INotification[]
	request?: mongoose.Types.ObjectId[]
	response?: mongoose.Types.ObjectId[]
	message?: mongoose.Types.ObjectId[]
	studentRating?: number
	imagePath: string
	friends?: mongoose.Types.ObjectId[]
	online: boolean
	deleted: boolean
	deletedAt: Date
	createdAt?: string
}

export interface IUsers {
	_id?: mongoose.Types.ObjectId
	codeChanllengeID: string
	firstName: string
	lastName: string
	email: string
	password: string
	role: Role
	dateOfBirth: Date
	description?: string
	gender: Gender
	address: string
	phoneNumber: string
	technology?: string
	socialAccounts?: string[]
	completedChallenges?: mongoose.Types.ObjectId[]
	notifications?: mongoose.Types.ObjectId[] | INotification[]
	request?: mongoose.Types.ObjectId[]
	response?: mongoose.Types.ObjectId[]
	message?: mongoose.Types.ObjectId[]
	studentRating?: number[]
	imagePath: string
	refreshToken?: string
	friends?: mongoose.Types.ObjectId[]
	online: boolean
	deleted: boolean
	deletedAt: Date
	createdAt?: Date
}

export interface UserGetField {
	codeChanllengeID?: string
	firstName?: string
	lastName?: string
	email?: string
	dateOfBirth?: string
	gender?: Gender
	role?: Role
	description?: string
	phoneNumber?: string
	adress?: string
	imagePath?: string
	technology?: string
	socialAccounts?: string[]
	completedChallenges?: mongoose.Types.ObjectId[]
	notifications?: mongoose.Types.ObjectId[]
	request?: mongoose.Types.ObjectId[]
	response?: mongoose.Types.ObjectId[]
	friends?: mongoose.Types.ObjectId[]
	online?: boolean
	message?: mongoose.Types.ObjectId[]
}
