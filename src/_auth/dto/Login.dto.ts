import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class LoginDto {
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
}
