import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception.js';

export class TaskNotFoundException extends AppException {
    readonly errorCode = 'TASK_NOT_FOUND';

    constructor(id: string) {
        super(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
}
