import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Types } from 'mongoose'

@ValidatorConstraint({ name: 'isObjectId', async: false })
export class IsObjectId implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		if (!Types.ObjectId.isValid(value)) {
			return false
		}
		return true
	}

	defaultMessage(args: ValidationArguments) {
		return 'Invalid ObjectId format'
	}
}
