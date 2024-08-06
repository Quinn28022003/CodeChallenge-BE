import { Expose } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, Validate } from 'class-validator'
import mongoose from 'mongoose'
import { BaseDto } from 'src/common/dto/Base.dto'
import { IsArrayNotEmpty } from 'src/common/validators/IsArrayNotEmpty'
import { IsObjectId } from 'src/common/validators/IsObjectId'

export class ResponseCreateDto extends BaseDto {
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
	description: string

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	@Min(0, { message: 'The value must be greater than or equal to 0' })
	@Max(100, { message: 'The value must be less than or equal to 100' })
	point: number

	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pathFile empty array to topic field' })
	pathFile: string[]
}
