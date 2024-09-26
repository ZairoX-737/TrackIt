import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { PrismaService } from 'src/prisma.service';
import { BoardModule } from 'src/board/board.module';

@Module({
	imports: [BoardModule],
	controllers: [ColumnController],
	providers: [ColumnService, PrismaService],
})
export class ColumnModule {}
