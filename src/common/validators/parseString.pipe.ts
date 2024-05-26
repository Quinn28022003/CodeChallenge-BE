import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
	transform(value: string, metadata: ArgumentMetadata): string {
		if (value === undefined) {
			return undefined
		}

		if (typeof value === 'string') {
			return value.trim()
		} else {
			throw new BadRequestException('Invalid string value')
		}
	}
}
