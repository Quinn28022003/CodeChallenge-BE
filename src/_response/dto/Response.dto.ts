import { Expose } from 'class-transformer'
import { IsArray, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator'
import mongoose from 'mongoose'
import { BaseDto } from 'src/common/dto/Base.dto'
import { IsObjectId } from 'src/common/validators/IsObjectId'
import { IsArrayNotEmpty } from 'src/common/validators/isArrayNotEmpty'

export class ResponseDto extends BaseDto {
	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	sender: mongoose.Schema.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	receiver: mongoose.Schema.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pathFile empty array to topic field' })
	pathFile: string[]
}
