import { Expose } from 'class-transformer'
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'
import { Gender } from 'src/enums/UserType'

export class UserCreateDto extends BaseDto {
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
	@Expose()
	@Length(8, 100)
	@IsString()
	password: string

	@IsNotEmpty()
	@Expose()
	@IsString()
	dateOfBirth: string

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsDefined()
	@IsEnum(Gender, { message: 'Gender must be a valid enum value' })
	gender: Gender

	@IsNotEmpty()
	@Expose()
	@Length(10, 11)
	phoneNumber: string

	@Expose()
	@IsOptional()
	@IsString()
	adress: string

	@Expose()
	@IsOptional()
	@IsString()
	imagePath: string
}
