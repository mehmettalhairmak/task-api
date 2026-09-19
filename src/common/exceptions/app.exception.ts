import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class AppException extends HttpException {
    abstract readonly errorCode: string;

    constructor(message: string, statusCode: HttpStatus) {
        super(message, statusCode);
    }
}
