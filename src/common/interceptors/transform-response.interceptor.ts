import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ApiSuccessResponse } from '../interfaces/api-success-response.interface.js';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SKIP_ENVELOPE_KEY } from '../decorators/skip-envelope.decorator.js';
import { Response } from 'express';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiSuccessResponse<T> | T
> {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const isSkipped = this.reflector.getAllAndOverride<boolean>(SKIP_ENVELOPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isSkipped) {
            return next.handle();
        }

        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                if (response.statusCode === HttpStatus.NO_CONTENT) {
                    return data;
                }

                const envelope: ApiSuccessResponse<T> = {
                    success: true,
                    statusCode: response.statusCode,
                    data: data ?? (null as unknown as T),
                    timestamp: new Date().toISOString(),
                };

                return envelope;
            }),
        );
    }
}
