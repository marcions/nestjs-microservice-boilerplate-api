import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDogsDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  breed: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
