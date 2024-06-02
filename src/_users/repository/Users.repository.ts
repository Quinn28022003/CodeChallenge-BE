import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { FilterQuery, Model } from 'mongoose'

import { UserCreateDto } from 'src/_users/dto/UserCreate.dto'
import { UserUpdateDto } from 'src/_users/dto/UserUpdate.dto'
import { Users, usersDocument } from 'src/_users/models/Users.schema'
import { Gender, Role, Sort } from 'src/enums/UserType'
import { UserGetField } from 'src/interfaces/Users'

@Injectable()
export class UsersRepository {
	private readonly excludedFields = {
		password: 0,
		refreshToken: 0,
		completedChallenges: 0,
		requests: 0,
		responses: 0,
		messages: 0
	}

	constructor(@InjectModel('users') private readonly userModel: Model<usersDocument>) {}

	async findAll(): Promise<Users[]> {
		try {
			const data: Users[] = await this.userModel
				.find()
				.select({
					password: 0,
					refreshToken: 0
				})
				.lean()
			return data
		} catch (e) {
			console.log('error users repository method findAll: ', e)
			throw e
		}
	}

	async findByField(body: UserGetField): Promise<Users[]> {
		try {
			const filter: FilterQuery<Users> = { ...body }
			const users: Users[] = await this.userModel
				.find(filter)
				.select({
					password: 0,
					refreshToken: 0
				})
				.lean()
			return users
		} catch (e) {
			console.log('error users repository method findByField: ', e)
			throw e
		}
	}

	async findBySort(field: string, sort: Sort, limit: number | null): Promise<Users[]> {
		try {
			const users: Users[] = await this.userModel
				.find()
				.select(this.excludedFields)
				.lean()
				.sort({ [field]: sort })
				.limit(limit)
			return users
		} catch (e) {
			console.log('error users repository method findBySort: ', e)
			throw e
		}
	}

	async findOneDetail(userId: mongoose.Types.ObjectId): Promise<Users> {
		try {
			const data: Users = await this.userModel.findById(userId).select(this.excludedFields).lean()

			return data
		} catch (e) {
			console.log('error users repository method findOneDetail: ', e)
			throw e
		}
	}

	async findOneByField(field: string, value: any): Promise<Users> {
		try {
			const data: Users = await this.userModel
				.findOne({ [field]: value })
				.lean()
				.exec()
			return data
		} catch (e) {
			console.log('error users repository method findOneByField: ', e)
			throw e
		}
	}

	async findOneExists(field: string, value: string): Promise<boolean> {
		try {
			const data: Users = await this.userModel.findOne({ [field]: value })
			return !!data
		} catch (e) {
			console.log('error users repository method findOneExists: ', e)
			throw e
		}
	}

	async create(data: UserCreateDto): Promise<Users> {
		try {
			const createdUser: Users = await this.userModel.create(data)
			return createdUser
		} catch (e) {
			console.log('error users repository method create: ', e)
			throw e
		}
	}

	async update(userId: mongoose.Types.ObjectId, data: UserUpdateDto): Promise<Users> {
		try {
			const updatedUser: Users = await this.userModel
				.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
				.exec()
			return updatedUser
		} catch (e) {
			console.log('error users repository method update: ', e)
			throw e
		}
	}

	async updateRefreshToken(id: mongoose.Types.ObjectId, refreshToken: string): Promise<void> {
		try {
			await this.userModel.findOneAndUpdate({ _id: id }, { $set: { refreshToken } }).exec()
		} catch (e) {
			console.log('error users repository method updateRefreshToken: ', e)
			throw e
		}
	}

	async updateByField(
		userId: mongoose.Types.ObjectId,
		field: string,
		value: string | Date | Gender | Role | boolean
	): Promise<void> {
		try {
			await this.userModel.findOneAndUpdate({ _id: userId }, { [field]: value }, { new: true }).exec()
		} catch (e) {
			console.log('error users repository method updateByField: ', e)
			throw e
		}
	}

	async updateByFieldIsArray(
		userId: mongoose.Types.ObjectId,
		field: string,
		value: mongoose.Types.ObjectId | string | number
	): Promise<void> {
		try {
			await this.userModel.findOneAndUpdate({ _id: userId }, { $push: { [field]: value } }, { new: true }).exec()
		} catch (e) {
			console.log('error users repository method updateByFieldIsArray: ', e)
			throw e
		}
	}

	async deleteByFieldIsArray(
		userId: mongoose.Types.ObjectId,
		field: string,
		value: mongoose.Types.ObjectId | string | number
	) {
		try {
			const updatedUser: any = await this.userModel
				.findOneAndUpdate({ _id: userId }, { $pull: { [field]: value } }, { new: true })
				.exec()

			if (!updatedUser) {
				throw new Error('User not found')
			}

			return updatedUser
		} catch (e) {
			console.log('error users repository method deleteByFieldIsArray: ', e)
			throw e
		}
	}
}
