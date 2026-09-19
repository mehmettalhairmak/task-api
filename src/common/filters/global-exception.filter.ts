import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
    ApiErrorResponse,
    ValidationErrorDetail,
} from '../interfaces/api-error-response.interface.js';
import { AppException } from '../exceptions/app.exception.js';

export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = 'INTERNAL_SERVER_ERROR';
        let message = 'An unexpected error occurred';
        let details: ValidationErrorDetail[] | null = null;

        if (exception instanceof AppException) {
            statusCode = exception.getStatus();
            errorCode = exception.errorCode;
            message = exception.message;
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                errorCode = exception.name;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const res = exceptionResponse as Record<string, any>;

                // Check array format for ValidationPipe errors
                if (Array.isArray(res.message)) {
                    errorCode = 'VALIDATION_FAILED';
                    message = 'Validation failed for one or more fields';
                    details = this.formatValidationErrors(res.message);
                } else {
                    message = res.message || exception.message;
                    errorCode = res.error
                        ? res.error.toUpperCase().replace(/\s+/g, '_')
                        : exception.name;
                }
            }
        } else {
            this.logger.error(
                `Unhandled exception: ${exception instanceof Error ? exception.message : 'Unknown'}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        const errorPayload: ApiErrorResponse = {
            success: false,
            statusCode,
            errorCode,
            message,
            details,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(statusCode).json(errorPayload);
    }

    private formatValidationErrors(messages: string[]): ValidationErrorDetail[] {
        const detailsMap = new Map<string, string[]>();

        for (const msg of messages) {
            const field = msg.split(' ')[0] || 'general'; // Assuming the field name is the first word in the message
            const currentErrors = detailsMap.get(field) || [];
            currentErrors.push(msg);
            detailsMap.set(field, currentErrors);
        }

        return Array.from(detailsMap.entries()).map(([field, errors]) => ({
            field,
            errors,
        }));
    }
}
