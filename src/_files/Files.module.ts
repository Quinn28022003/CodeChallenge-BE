import { Module } from '@nestjs/common'
import { FilesController } from 'src/_files/controllers/Files.controllers'
import { FilesService } from 'src/_files/services/Files.services'

@Module({
	controllers: [FilesController],
	providers: [FilesService]
})
export class FilesModule {}
