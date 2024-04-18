import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'

export class UsersDto extends BaseDto {
	@IsNotEmpty()
	@Expose()
	codeChanllengeID: string

	@IsNotEmpty()
	@Expose()
	firstName: string

	@IsNotEmpty()
	@Expose()
	lastName: string

	@IsEmail()
	@Expose()
	@IsNotEmpty()
	email: string

	@IsNotEmpty()
	password: string

	@IsNotEmpty()
	@Expose()
	dateOfBirth: string
}
