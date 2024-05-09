import { Expose } from 'class-transformer'
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from 'class-validator'
import mongoose from 'mongoose'
import { BaseDto } from 'src/common/dto/Base.dto'

import { IsArrayObjectId } from 'src/common/validators/IsArrayObjectId'
import { IsArrayNotEmpty } from 'src/common/validators/isArrayNotEmpty'
import { Difficulty } from 'src/enums/Type'
import { Case, Example } from 'src/interfaces/Challenge'

export class CreateChallengeDto extends BaseDto {
	@IsNotEmpty()
	@Expose()
	@IsString()
	title: string

	@Expose()
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty = Difficulty.EASY

	@Expose()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to topic field' })
	topic: string[]

	@Expose()
	@IsNotEmpty()
	@IsString()
	description: string

	@Expose()
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to example field' })
	case: Case[]

	@Expose()
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to example field' })
	example: Example[]

	@Expose()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to restriction field' })
	restriction: string[]

	@Expose()
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to language field' })
	language?: string[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to solutions field' })
	@Validate(IsArrayObjectId)
	solutions?: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(IsArrayNotEmpty, { message: 'Cannot pass empty array to comments field' })
	// @Validate(IsArrayObjectId)
	// comments?: mongoose.Schema.Types.ObjectId[]
}
