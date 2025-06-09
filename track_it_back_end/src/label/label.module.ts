import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [NotificationModule],
	controllers: [LabelController],
	providers: [LabelService, PrismaService],
	exports: [LabelService],
})
export class LabelModule {}
