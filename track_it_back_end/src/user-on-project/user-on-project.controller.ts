import { Controller, Get } from '@nestjs/common';
import { UserOnProjectService } from './user-on-project.service';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('user-on-project')
export class UserOnProjectController {
	constructor(private readonly userOnProjectService: UserOnProjectService) {}
}
