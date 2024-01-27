import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class ExceptionObjectDto {
	public static generate(statusCode: HttpStatus, message: string): object {
		return { statusCode, message };
	}
}
