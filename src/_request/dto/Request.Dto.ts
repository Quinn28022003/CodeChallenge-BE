import { Expose } from 'class-transformer'
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator'
import mongoose from 'mongoose'

import { BaseDto } from 'src/common/dto/Base.dto'
import { IsArrayNotEmpty } from 'src/common/validators/IsArrayNotEmpty'
import { IsObjectId } from 'src/common/validators/IsObjectId'
import { Status, Visibility } from 'src/enums/RequestType'

export class RequestDto extends BaseDto {
	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	sender: mongoose.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	receiver: mongoose.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	title: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsEnum(Status, { message: 'Status must be a valid enum value' })
	status: Status

	@Expose()
	@IsNotEmpty()
	@IsEnum(Visibility, { message: 'Visibility must be a valid enum value' })
	visibility: Visibility

	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pathFile empty array to topic field' })
	pathFile: string[]
}
