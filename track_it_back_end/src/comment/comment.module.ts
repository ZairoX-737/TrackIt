import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [NotificationModule],
	controllers: [CommentController],
	providers: [CommentService, PrismaService],
})
export class CommentModule {}
