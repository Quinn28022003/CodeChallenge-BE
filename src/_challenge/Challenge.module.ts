import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { ChallengeController } from 'src/_challenge/Challenge.controller'
import { ChallengeRepository } from 'src/_challenge/Challenge.repository'
import ChallengeSchema from 'src/_challenge/Challenge.schema'
import { ChallengeServices } from 'src/_challenge/Challenge.services'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'challenges',
				schema: ChallengeSchema
			}
		]),
		ConfigModule
	],

	controllers: [ChallengeController],
	providers: [ChallengeServices, ChallengeRepository]
})
export class ChallengeModule {}
