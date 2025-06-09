import { Module } from '@nestjs/common';
import { UserOnProjectService } from './user-on-project.service';
import { UserOnProjectController } from './user-on-project.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [NotificationModule],
	controllers: [UserOnProjectController],
	providers: [UserOnProjectService, PrismaService],
	exports: [UserOnProjectService],
})
export class UserOnProjectModule {}
