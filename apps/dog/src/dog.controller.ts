import { Controller, Get } from '@nestjs/common';
import { DogService } from './dog.service';

@Controller()
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Get()
  getHello(): string {
    return this.dogService.getHello();
  }
}
