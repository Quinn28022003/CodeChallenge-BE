import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DeleteResult } from 'mongodb'
import mongoose, { Model } from 'mongoose'

import { Notification } from 'src/_notifications/models/Notification.schema'
import { UserServices } from 'src/_users/services/Users.services'

@Injectable()
export class NotificationRepository {
	constructor(
		@InjectModel('notifications') private readonly notificationModel: Model<Notification>,
		private readonly userServices: UserServices
	) {}

	async findByField(field: string, userId: mongoose.Types.ObjectId): Promise<Notification[]> {
		try {
			const data: Notification[] = await this.notificationModel.find({ [field]: userId }).lean()
			return data
		} catch (e) {
			console.log('Error notification repository method findByField: ', e)
			throw e
		}
	}

	async findOne(notificationId: mongoose.Types.ObjectId): Promise<Notification> {
		try {
			const data: Notification = await this.notificationModel.findOne({ _id: notificationId })
			return data
		} catch (e) {
			console.log('Error notification repository method findOne: ', e)
			throw e
		}
	}

	async create(body: any): Promise<Notification> {
		try {
			const data: Notification = await this.notificationModel.create(body)
			return data
		} catch (e) {
			console.log('Error notification repository method create: ', e)
			throw e
		}
	}

	async delete(notificationId: mongoose.Types.ObjectId): Promise<DeleteResult> {
		try {
			const notification: Notification = await this.findOne(notificationId)
			await this.userServices.deleteNotification(
				notificationId,
				new mongoose.Types.ObjectId(notification.receiver.toString())
			)
			const data: DeleteResult = await this.notificationModel.deleteOne({ _id: notificationId })
			return data
		} catch (e) {
			console.log('Error notification repository method delete: ', e)
			throw e
		}
	}
}
