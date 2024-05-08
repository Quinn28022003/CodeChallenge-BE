import { Module } from '@nestjs/common'
import { ReviewerController } from 'src/_reviewer/controller/Reviewer.controller'
import { ReviewerServices } from 'src/_reviewer/services/Reviewer.services'
import { UsersModule } from 'src/_users/Users.module'

@Module({
	imports: [UsersModule],
	controllers: [ReviewerController],
	providers: [ReviewerServices]
})
export class ReviewerModule {}
