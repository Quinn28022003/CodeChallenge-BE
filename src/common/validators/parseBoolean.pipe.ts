import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string, boolean> {
	transform(value: string): boolean {
		if (value === undefined) return undefined
		const normalizedValue = value.toLowerCase().trim()
		if (normalizedValue === 'true') {
			return true
		} else if (normalizedValue === 'false') {
			return false
		} else throw new BadRequestException('Invalid boolean value')
	}
}
