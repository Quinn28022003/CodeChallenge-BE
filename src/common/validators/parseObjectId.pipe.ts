import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
	transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Invalid ObjectId')
		}
		return new Types.ObjectId(value)
	}
}
