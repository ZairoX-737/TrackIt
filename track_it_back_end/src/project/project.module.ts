import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma.service';
import { UserOnProjectModule } from 'src/user-on-project/user-on-project.module';
import { LabelModule } from 'src/label/label.module';

@Module({
	imports: [UserOnProjectModule, LabelModule],
	controllers: [ProjectController],
	providers: [ProjectService, PrismaService],
	exports: [ProjectService],
})
export class ProjectModule {}
