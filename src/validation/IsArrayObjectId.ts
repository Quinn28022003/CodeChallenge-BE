import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Types } from 'mongoose'

@ValidatorConstraint({ name: 'isArrayObjectId', async: false })
export class IsArrayObjectId implements ValidatorConstraintInterface {
	validate(values: any[], args: ValidationArguments) {
		for (const value of values) {
			if (!Types.ObjectId.isValid(value)) {
				return false
			}
		}
		return true
	}

	defaultMessage(args: ValidationArguments) {
		return 'Invalid ObjectId format in array'
	}
}
