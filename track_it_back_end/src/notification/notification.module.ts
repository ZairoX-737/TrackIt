import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationIntegrationService } from './notification-integration.service';
import { PrismaService } from '../prisma.service';
import { getJwtConfig } from '../config/jwt.config';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	controllers: [NotificationController],
	providers: [
		NotificationService,
		NotificationGateway,
		NotificationIntegrationService,
		PrismaService,
	],
	exports: [
		NotificationService,
		NotificationGateway,
		NotificationIntegrationService,
	],
})
export class NotificationModule {}
