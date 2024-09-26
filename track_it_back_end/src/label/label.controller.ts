import { Controller } from '@nestjs/common';
import { LabelService } from './label.service';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}
}
