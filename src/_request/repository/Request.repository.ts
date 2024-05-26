import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as fs from 'fs'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { SoftDeleteModel } from 'mongoose-delete'

import { RequestDto } from 'src/_request/dto/Request.Dto'
import { RequestUpdateDto } from 'src/_request/dto/RequestUpdate.Dto'
import { Request, RequestDocument } from 'src/_request/models/Request.schema'

@Injectable()
export class RequestRepository {
	constructor(@InjectModel(Request.name) private readonly requestModel: SoftDeleteModel<RequestDocument>) {}

	async find(): Promise<Request[]> {
		const data: Request[] = await this.requestModel.find()
		return data
	}

	async findByReceiver(field: string, value: mongoose.Types.ObjectId): Promise<Request[]> {
		const data: Request[] = await this.requestModel.find({ [field]: value })
		return data
	}

	async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Request> {
		const data: Request = await this.requestModel.findOne({ _id: id })
		return data
	}

	async findOneDeleted(id: mongoose.Schema.Types.ObjectId): Promise<Request> {
		const data: Request = await this.requestModel.findOneDeleted({ _id: id })
		return data
	}

	async create(body: RequestDto): Promise<Request> {
		const data: Request = await this.requestModel.create(body)
		return data
	}

	async update(requestId: mongoose.Types.ObjectId, body: RequestUpdateDto): Promise<UpdateWriteOpResult> {
		const data: UpdateWriteOpResult = await this.requestModel.updateOne({ _id: requestId }, body)
		return data
	}

	async delete(requestId: mongoose.Schema.Types.ObjectId): Promise<any> {
		const request = await this.findOneDeleted(requestId)
		request.pathFile.forEach((path: string) => {
			try {
				fs.unlinkSync(path)
				console.log(`Deleted the file under ${path}`)
			} catch (err) {
				console.log('An error occurred: ', err.message)
			}
		})

		return this.requestModel.deleteOne({ _id: requestId }).exec()
	}

	async softDelete(requestId: mongoose.Schema.Types.ObjectId): Promise<any> {
		return this.requestModel.delete({ _id: requestId }).exec()
	}
}