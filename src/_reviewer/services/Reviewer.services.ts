import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { UserGetFieldDto } from 'src/_users/dto/UserGetField'
import { UserServices } from 'src/_users/services/Users.services'
import { IUsersConvert } from 'src/interfaces/Users'

@Injectable()
export class ReviewerServices {
	constructor(private UserServices: UserServices) {}
	async list(body: UserGetFieldDto): Promise<IUsersConvert[]> {
		const data: IUsersConvert[] = await this.UserServices.listByField(body)

		return data
	}

	async detail(userId: mongoose.Types.ObjectId): Promise<IUsersConvert> {
		const data: IUsersConvert = await this.UserServices.findOneDetail(userId)

		return data
	}
}
