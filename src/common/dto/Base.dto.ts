import { Expose, plainToInstance } from 'class-transformer'
import mongoose, { Date } from 'mongoose'

export abstract class BaseDto {
	@Expose()
	_id: mongoose.ObjectId

	@Expose()
	deleted: boolean

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date

	@Expose()
	deletedAt: Date

	static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
		return plainToInstance(this, obj, { excludeExtraneousValues: true })
	}
}
