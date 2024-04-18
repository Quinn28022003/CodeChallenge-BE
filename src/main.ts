import { NestFactory } from '@nestjs/core'

import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(process.env.PORT, (): void => {
		console.log(` 🍎 The server has started successfully with port http://localhost:${process.env.PORT}`)
	})
}

bootstrap()
