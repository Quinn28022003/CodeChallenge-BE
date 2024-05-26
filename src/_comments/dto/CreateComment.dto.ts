import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString, Validate } from 'class-validator'
import mongoose from 'mongoose'

import { BaseDto } from 'src/common/dto/Base.dto'
import { IsObjectId } from 'src/common/validators/IsObjectId'

export class CreateCommnetDto extends BaseDto {
	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	idUser: mongoose.Schema.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@Validate(IsObjectId)
	idChallenge: mongoose.Schema.Types.ObjectId

	@Expose()
	@IsNotEmpty()
	@IsString()
	content: string
}
