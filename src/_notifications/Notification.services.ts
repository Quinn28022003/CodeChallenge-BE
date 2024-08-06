import { Injectable } from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import mongoose from 'mongoose'

import { NotificationRepository } from 'src/_notifications/Notification.repository'
import { Notification } from 'src/_notifications/Notification.schema'
import { UserServices } from 'src/_users/Users.services'
import { INotification } from 'src/interfaces/Notification'
import { ICreateNotificationBody } from 'src/interfaces/Subscriber'
import { IUsersConvert } from 'src/interfaces/Users'
import { DateFormatter } from 'src/utils/ConvertDate'

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

	async findOneByField(field: string, value: mongoose.Types.ObjectId | string | boolean): Promise<Notification> {
		try {
			const data: Notification = await this.notificationRepository.findOneByField(field, value)
			return data
		} catch (e) {
			console.log('Error notification services method findOne: ', e)
			throw e
		}
	}

	async deleteByIdRequest(value: mongoose.Types.ObjectId): Promise<Notification[]> {
		try {
			const notification: INotification = await this.notificationRepository.findOneByField(
				'idRequest',
				new mongoose.Types.ObjectId(value)
			)
			const data: INotification[] = await this.notificationRepository.deleteOneByField(
				'idRequest',
				new mongoose.Types.ObjectId(notification._id),
				new mongoose.Types.ObjectId(notification.receiver),
				new mongoose.Types.ObjectId(value)
			)
			return data
		} catch (e) {
			console.log('Error notification services method deleteByIdRequest: ', e)
			throw e
		}
	}

	async create(body: ICreateNotificationBody): Promise<INotification> {
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
