import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { ChallengeController } from 'src/_challenge/controllers/Challenge.controller'
import ChallengeSchema, { Challenge } from 'src/_challenge/models/Challenge.schema'
import { ChallengeRepository } from 'src/_challenge/repository/Challenge.repository'
import { ChallengeServices } from 'src/_challenge/services/Challenge.services'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Challenge.name,
				schema: ChallengeSchema
			}
		]),
		ConfigModule
	],
	controllers: [ChallengeController],
	providers: [ChallengeServices, ChallengeRepository]
})
export class ChallengeModule {}
