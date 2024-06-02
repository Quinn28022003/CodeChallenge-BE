import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'
import { Sort } from 'src/enums/UserType'

export class UserGetByFieldSort extends BaseDto {
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
	limit: number
}
