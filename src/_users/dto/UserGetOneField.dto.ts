import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'

export class UserGetOneField extends BaseDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	@IsEnum(UserGetOneField, { message: 'Field must be a valid enum value' })
	field: UserGetOneField

	@Expose()
	@IsNotEmpty()
	value: any
}
