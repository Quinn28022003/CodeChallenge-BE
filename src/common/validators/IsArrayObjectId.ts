import { Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Types } from 'mongoose'

@ValidatorConstraint({ name: 'isArrayObjectId', async: false })
@Injectable()
export class IsArrayObjectId implements ValidatorConstraintInterface {
	validate(values: any[]) {
		for (const value of values) {
			if (!Types.ObjectId.isValid(value)) return false
		}
		return true
	}

	defaultMessage() {
		return 'Invalid ObjectId format in array'
	}
}
