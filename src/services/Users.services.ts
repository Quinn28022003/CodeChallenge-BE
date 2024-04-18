import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Users } from 'src/models/Users.schema'

@Injectable()
export class UserServices {
	constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}
	async create(dataReq: any): Promise<any> {
		const createdUser = new this.userModel(dataReq)
		return createdUser.save()
	}
}
