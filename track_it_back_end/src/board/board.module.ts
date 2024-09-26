import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaService } from 'src/prisma.service';
import { ProjectModule } from 'src/project/project.module';

@Module({
	imports: [ProjectModule],
	controllers: [BoardController],
	providers: [BoardService, PrismaService],
	exports: [BoardService],
})
export class BoardModule {}
