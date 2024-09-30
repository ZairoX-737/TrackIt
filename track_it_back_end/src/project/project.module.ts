import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma.service';
import { UserOnProjectModule } from 'src/user-on-project/user-on-project.module';

@Module({
	imports: [UserOnProjectModule],
	controllers: [ProjectController],
	providers: [ProjectService, PrismaService],
	exports: [ProjectService],
})
export class ProjectModule {}
