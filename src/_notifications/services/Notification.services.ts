import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'

import { Notification } from 'src/_notifications/models/Notification.schema'
import { NotificationRepository } from 'src/_notifications/repositoty/Notification.repository'
import { UserServices } from 'src/_users/services/Users.services'
import { INotification } from 'src/interfaces/Notification'
import { IUsersConvert } from 'src/interfaces/Users'
import { DateFormatter } from 'src/utils/convertDate'

@Injectable()
export class NotificationServices {
	private initDateFormatter: DateFormatter = null
	constructor(
		private readonly notificationRepository: NotificationRepository,
		private readonly userServices: UserServices
	) {
		this.initDateFormatter = new DateFormatter()
	}

	async findByField(field: string, userId: mongoose.Types.ObjectId): Promise<Notification[]> {
		try {
			const data: Notification[] = await this.notificationRepository.findByField(field, userId)
			const notification: Notification[] = await Promise.all(
				data.map(async (element: any): Promise<INotification> => {
					const user: IUsersConvert = await this.userServices.findOneDetail(
						new mongoose.Types.ObjectId(element.sender.toString())
					)
					const createdAtDate: string = this.initDateFormatter.convert(new Date(element.createdAt))
					return {
						...element,
						sender: { ...user },
						createdAt: createdAtDate
					}
				})
			)
			return notification
		} catch (e) {
			console.log('Error notification services method findByField: ', e)
			throw e
		}
	}

	async findOne(notificationId: mongoose.Types.ObjectId): Promise<Notification> {
		try {
			const data: Notification = await this.notificationRepository.findOne(notificationId)
			return data
		} catch (e) {
			console.log('Error notification services method findOne: ', e)
			throw e
		}
	}

	async create(body: any): Promise<INotification> {
		try {
			const data: INotification = await this.notificationRepository.create(body)
			return data
		} catch (e) {
			console.log('Error notification services method create: ', e)
			throw e
		}
	}

	async delete(notificationId: mongoose.Types.ObjectId): Promise<DeleteResult> {
		try {
			const data: DeleteResult = await this.notificationRepository.delete(notificationId)
			return data
		} catch (e) {
			console.log('Error notification services method delete: ', e)
			throw e
		}
	}
}
