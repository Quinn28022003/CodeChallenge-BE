import { Expose } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsDefined,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Max,
	Min,
	Validate
} from 'class-validator'
import mongoose from 'mongoose'

import { BaseDto } from 'src/common/dto/Base.dto'
import { Gender, Role } from 'src/enums/Type'
import { IsArrayObjectId } from 'src/validation/IsArrayObjectId'

export class UsersDto extends BaseDto {
	@IsNotEmpty()
	@Expose()
	@IsString()
	codeChanllengeID: string

	@IsNotEmpty()
	@Expose()
	@IsString()
	firstName: string

	@IsNotEmpty()
	@Expose()
	@IsString()
	lastName: string

	@IsEmail()
	@Expose()
	@IsNotEmpty()
	@IsString()
	email: string

	@IsNotEmpty()
	@Length(8, 100)
	@IsString()
	password: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(Role, { message: 'Role must be a valid enum value' })
	role: Role

	@IsNotEmpty()
	@Expose()
	@IsString()
	dateOfBirth: string

	@Expose()
	@IsOptional()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(Gender, { message: 'Gender must be a valid enum value' })
	gender: Gender

	@Expose()
	@IsOptional()
	@IsString()
	adress: string

	@Expose()
	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true, message: 'technology items must not be empty' })
	technology: string[]

	@Expose()
	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true, message: 'socialAccounts items must not be empty' })
	socialAccounts: string[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	completedChallenges: mongoose.Schema.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	notifications: mongoose.Schema.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	request: mongoose.Schema.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	response: mongoose.Schema.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	message: mongoose.Schema.Types.ObjectId[]

	@Expose()
	@IsNumber({}, { message: 'StudentRating must be a number' })
	@IsInt({ message: 'StudentRating must be an integer number' })
	@Min(1, { message: 'StudentRating must be between 1 and 5' })
	@Max(5, { message: 'StudentRating must be between 1 and 5' })
	studentRating: number
}
