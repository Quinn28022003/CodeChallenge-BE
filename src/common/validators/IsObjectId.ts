import { Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Types } from 'mongoose'

@ValidatorConstraint({ name: 'isObjectId', async: false })
@Injectable()
export class IsObjectId implements ValidatorConstraintInterface {
	validate(value: any): boolean {
		if (!Types.ObjectId.isValid(value)) return false
		return true
	}

	defaultMessage(): string {
		return 'Invalid ObjectId format'
	}
}
