import { Injectable } from '@nestjs/common'
import { UserServices } from 'src/_users/services/Users.services'
import { IfindAll } from 'src/interfaces/Users'

@Injectable()
export class ReviewerServices {
	constructor(private UserServices: UserServices) {}
	async list(): Promise<IfindAll[]> {
		const data: IfindAll[] = await this.UserServices.list()

		return data
	}

	async detail(userId: string): Promise<IfindAll> {
		const data: IfindAll = await this.UserServices.detail('_id', userId)

		return data
	}
}
