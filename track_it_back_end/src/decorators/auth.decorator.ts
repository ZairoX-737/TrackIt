import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
