import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import { CreateUsersDto } from 'src/_users/dto/CreateUsers.dto'
import { UpdateUsersDto } from 'src/_users/dto/UpdateUsers.dto'
import { Users } from 'src/_users/models/Users.schema'
import { UsersRepository } from 'src/_users/repository/Users.repository'
import { IfindAll } from 'src/interfaces/Users'

@Injectable()
export class UserServices {
	constructor(private readonly userRepository: UsersRepository) {}

	async list(): Promise<IfindAll[]> {
		return this.userRepository.findAll()
	}

	async detail(field: string, userId: string): Promise<IfindAll> {
		const data: IfindAll = await this.userRepository.findOneWithDetails(field, userId)
		return data
	}

	async create(data: CreateUsersDto): Promise<Users> {
		const createdUser = await this.userRepository.create(data)
		return createdUser
	}

	async update(id: mongoose.Types.ObjectId, data: UpdateUsersDto): Promise<Users> {
		const updateUser = await this.userRepository.update(id, data)
		return updateUser
	}

	async updateRefreshToken(id: mongoose.Types.ObjectId, refreshToken: string): Promise<void> {
		await this.userRepository.updateRefreshToken(id, refreshToken)
	}

	async checkEmail(email: string): Promise<boolean> {
		const user = await this.userRepository.findOneExists('email', email)
		return !!user
	}

	async checkPassword(email: string, password: string): Promise<IfindAll> {
		const user = await this.userRepository.findOneById('email', email)

		const data: IfindAll = await this.userRepository.findOneWithDetails('email', email)
		if (!user) {
			return null
		}
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (isPasswordValid) {
			return data
		} else {
			return null
		}
	}
}
