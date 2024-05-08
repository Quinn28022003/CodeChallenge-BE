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
	Length
} from 'class-validator'

import { BaseDto } from 'src/common/dto/Base.dto'
import { Gender } from 'src/enums/Type'

export class UpdateUsersDto extends BaseDto {
	@IsOptional()
	@IsNotEmpty()
	@Expose()
	@IsString()
	codeChanllengeID: string

	@IsOptional()
	@IsNotEmpty()
	@Expose()
	@IsString()
	firstName: string

	@IsOptional()
	@IsNotEmpty()
	@Expose()
	@IsString()
	lastName: string

	@IsOptional()
	@IsEmail()
	@Expose()
	@IsNotEmpty()
	@IsString()
	email: string

	@IsOptional()
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

	@IsOptional()
	@IsNotEmpty()
	@Expose()
	@Length(10, 11)
	phoneNumber: string

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(IsArrayObjectId)
	// completedChallenges: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(IsArrayObjectId)
	// notifications: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(IsArrayObjectId)
	// request: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(IsArrayObjectId)
	// response: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNotEmpty()
	// @IsOptional()
	// @Validate(function (value: mongoose.Schema.Types.ObjectId[]) {
	// 	return this.isArrayObjectId.validate(value)
	// })
	// message: mongoose.Schema.Types.ObjectId[]

	// @Expose()
	// @IsNumber({}, { message: 'StudentRating must be a number' })
	// @IsInt({ message: 'StudentRating must be an integer number' })
	// @Min(1, { message: 'StudentRating must be between 1 and 5' })
	// @Max(5, { message: 'StudentRating must be between 1 and 5' })
	// studentRating: number
}
