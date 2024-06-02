import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswordDto {
	@Expose()
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	oldPassword: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	newPassword: string
}
