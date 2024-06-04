import { Expose } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsDefined,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Validate
} from 'class-validator'
import mongoose from 'mongoose'

import { BaseDto } from 'src/common/dto/Base.dto'
import { IsArrayObjectId } from 'src/common/validators/IsArrayObjectId'
import { Gender, Role, Sort } from 'src/enums/UserType'

export class UserGetFieldDto extends BaseDto {
	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	codeChanllengeID: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	firstName: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	lastName: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	@IsString()
	email: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	dateOfBirth: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(Gender, { message: 'Gender must be a valid enum value' })
	gender: Gender

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(Role, { message: 'Role must be a valid enum value' })
	role: Role

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@Length(10, 11)
	phoneNumber: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	adress: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	imagePath: string

	@Expose()
	@IsOptional()
	@IsString()
	technology: string

	@Expose()
	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsNotEmpty({ each: true, message: 'SocialAccounts items must not be empty' })
	socialAccounts: string[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	completedChallenges: mongoose.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	notifications: mongoose.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	request: mongoose.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	response: mongoose.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsArrayObjectId)
	friends: mongoose.Types.ObjectId[]

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	online: boolean

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@IsEnum(Sort, { message: 'sort must be a valid enum value' })
	sort: Sort

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	field: string

	@Expose()
	@IsNotEmpty()
	@IsOptional()
	@Validate(function (value: mongoose.Types.ObjectId[]) {
		return this.isArrayObjectId.validate(value)
	})
	message: mongoose.Types.ObjectId[]
}
