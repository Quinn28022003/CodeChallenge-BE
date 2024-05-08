import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'

export class SubscriberDto extends BaseDto {
	@IsEmail()
	@Expose()
	@IsNotEmpty()
	@IsString()
	email: string
}
