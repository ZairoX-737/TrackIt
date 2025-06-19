import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	const configService = app.get(ConfigService);
	const BACKEND_PORT =
		configService.get<string>('PORT') ||
		configService.get<string>('BACKEND_PORT') ||
		'4200';

	app.use(cookieParser());
	app.enableCors({
		origin: ['http://localhost:3001', 'http://frontend:3001'],
		credentials: true,
		exposedHeaders: 'set-cookie',
	});
	await app.listen(BACKEND_PORT, '0.0.0.0');

	// Логирование информации о запуске
	const logger = new Logger('Bootstrap');
	logger.log(`🚀 Backend server is running!`);
	logger.log(`🔗 API Base URL: http://localhost:${BACKEND_PORT}/api`);
	logger.log(`🐳 Docker Network URL: http://backend:${BACKEND_PORT}/api`);
	logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
