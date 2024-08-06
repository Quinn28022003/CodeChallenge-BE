import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import { UsersRepository } from 'src/_users/Users.repository'
import { Users } from 'src/_users/Users.schema'
import { UserCreateDto } from 'src/_users/dto/UserCreate.dto'
import { UserGetFieldDto } from 'src/_users/dto/UserGetByField.dto'
import { UserUpdateDto } from 'src/_users/dto/UserUpdate.dto'
import { Role, Sort } from 'src/enums/UserType'
import { IUsers, IUsersConvert, UserGetField } from 'src/interfaces/Users'
import { DateFormatter } from 'src/utils/ConvertDate'
import { ConvertImage } from 'src/utils/ConvertImage'

@Injectable()
export class UserServices {
	private initConvertImage: ConvertImage = null
	private initDateFormatter: DateFormatter = null

	constructor(private readonly userRepository: UsersRepository) {
		this.initConvertImage = new ConvertImage()
		this.initDateFormatter = new DateFormatter()
	}

	async list(): Promise<IUsersConvert[]> {
		try {
			const data: Users[] = await this.userRepository.findAll()

			const container: IUsersConvert[] = await Promise.all(
				data.map(async (item: Users): Promise<IUsersConvert> => {
					const totalRating: number = item.rating.reduce((acc: number, curr: number) => acc + curr, 0)
					const averageRating: number = item.rating.length > 0 ? totalRating / item.rating.length : null
					const date: string = this.initDateFormatter.convert(item.dateOfBirth)
					const base64Img: string = await this.initConvertImage.toBase64(item.imagePath)

					return {
						...item,
						fullName: `${item.lastName} ${item.firstName}`,
						imagePath: base64Img,
						rating: averageRating,
						dateOfBirth: date
					}
				})
			)
			return container
		} catch (e) {
			console.log('Error users services method list: ', e)
			throw e
		}
	}

	async listByField(body: UserGetField): Promise<IUsersConvert[]> {
		try {
			const data: Users[] = await this.userRepository.findByField(body)

			const container: IUsersConvert[] = await Promise.all(
				data.map(async (item: Users): Promise<IUsersConvert> => {
					let totalRating: number = 0
					item.rating.forEach((element: number) => {
						totalRating += Number(element)
					})
					const averageRating: number = item.rating.length > 0 ? totalRating / item.rating.length : null
					const date: string = this.initDateFormatter.convert(item.dateOfBirth)
					const base64Img: string = await this.initConvertImage.toBase64(item.imagePath)

					return {
						...item,
						fullName: `${item.lastName} ${item.firstName}`,
						imagePath: base64Img,
						rating: averageRating,
						dateOfBirth: date
					}
				})
			)
			return container
		} catch (e) {
			console.log('Error users services method listByField: ', e)
			throw e
		}
	}

	async findBySort(field: string, sort: Sort, limit: number | null): Promise<IUsersConvert[]> {
		try {
			const data: IUsers[] = await this.userRepository.findBySort(field, sort, limit)
			const container: IUsersConvert[] = await Promise.all(
				data.map(async (item: Users): Promise<IUsersConvert> => {
					let totalRating: number = 0
					item.rating.forEach((element: number) => {
						totalRating += Number(element)
					})
					const averageRating: number = item.rating.length > 0 ? totalRating / item.rating.length : null
					const date: string = this.initDateFormatter.convert(item.dateOfBirth)
					const base64Img: string = await this.initConvertImage.toBase64(item.imagePath)

					return {
						...item,
						fullName: `${item.lastName} ${item.firstName}`,
						imagePath: base64Img,
						rating: averageRating,
						dateOfBirth: date
					}
				})
			)
			return container
		} catch (e) {
			console.log('error users repository method findByCreatedAtSortACS: ', e)
			throw e
		}
	}

	async findQuantityByField(body: UserGetFieldDto): Promise<number> {
		try {
			const data: Users[] = await this.userRepository.findByField(body)
			return data.length
		} catch (e) {
			console.log('Error users services method findByField: ', e)
			throw e
		}
	}

	async findTotalUsers(): Promise<number> {
		try {
			const data: Users[] = await this.userRepository.findAll()
			return data.length
		} catch (e) {
			console.log('Error users services method findQuantity: ', e)
			throw e
		}
	}

	async findOneDetail(userId: mongoose.Types.ObjectId): Promise<IUsersConvert> {
		try {
			const data: Users = await this.userRepository.findOneDetail(userId)
			const base64Img: string = await this.initConvertImage.toBase64(data.imagePath)
			const date: string = this.initDateFormatter.convert(data.dateOfBirth)
			const totalRating: number = data.rating.reduce((acc: number, curr: number) => acc + curr, 0)
			const averageRating: number = data.rating.length > 0 ? totalRating / data.rating.length : null
			return {
				...data,
				fullName: `${data.lastName} ${data.firstName}`,
				imagePath: base64Img,
				dateOfBirth: date,
				rating: averageRating
			}
		} catch (e) {
			console.log('Error users services method findOneDetail: ', e)
			throw e
		}
	}

	async findFriends(userId: mongoose.Types.ObjectId) {
		try {
			const data: IUsers = await this.userRepository.findOneDetail(userId)

			const container: IUsersConvert[] = await Promise.all(
				data.friends.map(async (item: mongoose.Types.ObjectId): Promise<IUsersConvert> => {
					const data: IUsersConvert = await this.findOneDetail(item)
					return data
				})
			)
			return container
		} catch (e) {
			console.log('Error users services method findFriends: ', e)
			throw e
		}
	}

	async findOneByField(field: string, value: any): Promise<IUsers> {
		try {
			const data: IUsers = await this.userRepository.findOneByField(field, value)
			return data
		} catch (e) {
			console.log('Error users services method findOneByField: ', e)
			throw e
		}
	}

	async create(data: UserCreateDto): Promise<IUsers> {
		try {
			const body1: UserGetField = { role: Role.REVIEWER }
			const createdUser: IUsers = await this.userRepository.create(data)
			const list: IUsersConvert[] = await this.listByField(body1)
			const admin: IUsers = await this.findOneByField('role', Role.ADMIN)

			const listFriends: mongoose.Types.ObjectId[] = [admin._id]

			list.forEach((element: IUsersConvert) => {
				listFriends.push(element._id)
			})

			listFriends.forEach(async (element: mongoose.Types.ObjectId) => {
				await this.userRepository.updateByFieldIsArray(createdUser._id, 'friends', new mongoose.Types.ObjectId(element))
			})

			return createdUser
		} catch (e) {
			console.log('Error users services method create: ', e)
			throw e
		}
	}

	async update(userId: mongoose.Types.ObjectId, data: UserUpdateDto): Promise<Users> {
		try {
			const updateUser: Users = await this.userRepository.update(userId, data)
			return updateUser
		} catch (e) {
			console.log('Error users services method update: ', e)
			throw e
		}
	}

	async changePassword(userId: mongoose.Types.ObjectId, value: string): Promise<void> {
		try {
			await this.userRepository.updateByField(userId, 'password', value)
		} catch (e) {
			console.log('Error users services method updateOnline: ', e)
			throw e
		}
	}

	async updateRating(userId: mongoose.Types.ObjectId, value: number): Promise<void> {
		try {
			await this.userRepository.updateByFieldIsArray(userId, 'rating', value)
		} catch (e) {
			console.log('Error users services method updateOnline: ', e)
			throw e
		}
	}

	async updateOnline(userId: mongoose.Types.ObjectId, value: boolean) {
		try {
			await this.userRepository.updateByField(userId, 'online', value)
		} catch (e) {
			console.log('Error users services method updateOnline: ', e)
			throw e
		}
	}

	async updateFriends(userId: mongoose.Types.ObjectId, value: mongoose.Types.ObjectId) {
		try {
			await this.userRepository.updateByFieldIsArray(userId, 'friends', new mongoose.Types.ObjectId(value))
		} catch (e) {
			console.log('Error users services method updateFriends: ', e)
			throw e
		}
	}

	async updateRefreshToken(id: mongoose.Types.ObjectId, refreshToken: string): Promise<void> {
		try {
			await this.userRepository.updateRefreshToken(id, refreshToken)
		} catch (e) {
			console.log('Error users services method updateRefreshToken: ', e)
			throw e
		}
	}

	async updateNotification(userId: mongoose.Types.ObjectId, value: mongoose.Types.ObjectId): Promise<void> {
		try {
			await this.userRepository.updateByFieldIsArray(userId, 'notifications', new mongoose.Types.ObjectId(value))
		} catch (e) {
			console.log('Error users services method updateNotification: ', e)
			throw e
		}
	}

	async deleteNotification(notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
		try {
			const data = await this.userRepository.deleteByFieldIsArray(
				userId,
				'notifications',
				new mongoose.Types.ObjectId(notificationId)
			)
			return data
		} catch (e) {
			console.log('Error users services method deleteNotification: ', e)
			throw e
		}
	}

	async checkEmail(email: string): Promise<boolean> {
		try {
			const user: boolean = await this.userRepository.findOneExists('email', email)
			return !!user
		} catch (e) {
			console.log('Error users services method checkEmail: ', e)
			throw e
		}
	}

	async checkPassword(email: string, password: string): Promise<IUsers> {
		try {
			const user: IUsers = await this.userRepository.findOneByField('email', email)
			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (isPasswordValid) {
				return user
			} else {
				return null
			}
		} catch (e) {
			console.log('Error users services method checkPassword: ', e)
			throw e
		}
	}
}
