import mongoose from 'mongoose'

import { Gender, Role } from 'src/enums/Type'

export interface IfindAll {
	_id: mongoose.Types.ObjectId
	codeChanllengeID: string
	fullName: string
	email: string
	role: Role
	dateOfBirth: Date
	password: string
	description: string
	gender: Gender
	address: string
	technology: string[]
	socialAccounts: string[]
	completedChallenges: mongoose.Types.ObjectId[]
	notifications: mongoose.Types.ObjectId[]
	request: mongoose.Types.ObjectId[]
	response: mongoose.Types.ObjectId[]
	message: mongoose.Types.ObjectId[]
	studentRating: number | null
	refreshToken: string
	deleted: boolean
	deletedAt: Date
}
