import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateUsersDto } from 'src/_users/dto/CreateUsers.dto'
import { UpdateUsersDto } from 'src/_users/dto/UpdateUsers.dto'
import { Users, usersDocument } from 'src/_users/models/Users.schema'
import { IfindAll } from 'src/interfaces/Users'

@Injectable()
export class UsersRepository {
	constructor(@InjectModel(Users.name) private readonly userModel: Model<usersDocument>) {}

	async findAll(): Promise<IfindAll[]> {
		const users = await this.userModel.find().select({
			password: 0,
			refreshToken: 0
		})

		const transformedUsers = users.map(user => {
			const totalRating = user.studentRating.reduce((acc, curr) => acc + curr, 0)
			const averageRating = user.studentRating.length > 0 ? totalRating / user.studentRating.length : null
			return { ...user.toObject(), studentRating: averageRating } as IfindAll
		})

		return transformedUsers
	}

	async findOneExists(field: string, value: string): Promise<boolean> {
		const data: Users = await this.userModel.findOne({ [field]: value })
		return !!data
	}

	async findOneById(field: string, value: string): Promise<Users> {
		const data: Users = await this.userModel.findOne({ [field]: value }).exec()
		if (!data) {
			return null
		}
		return data
	}

	async findOneWithDetails(field: string, value: string): Promise<IfindAll> {
		const data = await this.userModel.findOne({ [field]: value }).exec()
		if (!data) {
			return null
		}
		return data.toObject()
	}

	async create(data: CreateUsersDto): Promise<Users> {
		const createdUser: Users = await this.userModel.create(data)
		return createdUser
	}

	async update(id: mongoose.Types.ObjectId, data: UpdateUsersDto): Promise<Users> {
		const updatedUser: Users = await this.userModel.findOneAndUpdate({ _id: id }, { $set: data }).exec()
		return updatedUser
	}

	async updateRefreshToken(id: mongoose.Types.ObjectId, refreshToken: string): Promise<void> {
		await this.userModel.findOneAndUpdate({ _id: id }, { $set: { refreshToken } }).exec()
	}
}
