import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { PrismaService } from 'src/prisma.service';
import { BoardModule } from 'src/board/board.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [BoardModule, NotificationModule],
	controllers: [ColumnController],
	providers: [ColumnService, PrismaService],
})
export class ColumnModule {}
