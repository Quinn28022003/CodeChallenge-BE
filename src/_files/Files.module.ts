import { Module } from '@nestjs/common'
import { FilesController } from 'src/_files/Files.controllers'
import { FilesService } from 'src/_files/Files.services'

@Module({
	controllers: [FilesController],
	providers: [FilesService]
})
export class FilesModule {}
