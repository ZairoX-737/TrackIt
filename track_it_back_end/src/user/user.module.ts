import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { TaskModule } from 'src/task/task.module';

@Module({
	imports: [TaskModule],
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService],
})
export class UserModule {}
