import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class Response {
  @ApiProperty({ type: 'number', enum: Object.values(HttpStatus).filter((a) => typeof a === 'number') })
  statusCode: number;

  @ApiProperty({ type: 'string' })
  message: string | string[];
}

export class ResponseTypeDto {
  @ApiProperty({ type: Response })
  'data': Response;
}
