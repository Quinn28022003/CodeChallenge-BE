import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as multer from 'multer'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(multer().any())
	app.enableCors({
		origin: [process.env.URL_FRONTEND],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	})
	app.use(cookieParser())
	await app.listen(process.env.PORT, (): void => {
		console.log(` 🍎 The server has started successfully with port http://localhost:${process.env.PORT}`)
	})
}

bootstrap()
