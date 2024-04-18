import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Users } from 'src/models/Users.schema'

@Injectable()
export class UserServices {
	constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}
	async list(): Promise<any> {
		const users = await this.userModel.find()
		const transformedUsers = users.map(user => {
			const totalRating = user.studentRating.reduce((acc, curr) => acc + curr, 0)
			const averageRating = user.studentRating.length > 0 ? totalRating / user.studentRating.length : null
			return { ...user.toObject(), studentRating: averageRating }
		})
		return transformedUsers
	}

	async create(dataReq: any): Promise<any> {
		const createdUser = new this.userModel(dataReq)
		return createdUser.save()
	}
}
