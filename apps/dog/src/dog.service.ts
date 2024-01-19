import { Injectable } from '@nestjs/common';

@Injectable()
export class DogService {
  getHello(): string {
    return 'Hello World!';
  }
}
