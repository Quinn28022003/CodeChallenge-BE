import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator'
import mongoose from 'mongoose'

import { BaseDto } from 'src/common/dto/Base.dto'
import { IsObjectId } from 'src/common/validators/IsObjectId'
import { Status, Visibility } from 'src/enums/RequestType'

export class RequestGetByFieldDto extends BaseDto {
	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@Validate(IsObjectId)
	sender: mongoose.Types.ObjectId

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@Validate(IsObjectId)
	receiver: mongoose.Types.ObjectId

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	name: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	title: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(Status, { message: 'Status must be a valid enum value' })
	status: Status

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(Visibility, { message: 'Visibility must be a valid enum value' })
	visibility: Visibility
}
