import { Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'isArrayNotEmpty', async: false })
@Injectable()
export class IsArrayNotEmpty implements ValidatorConstraintInterface {
	validate(values: any[]) {
		if (values.length > 0) return true
		return false
	}
}
