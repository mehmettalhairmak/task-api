import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    await app.listen(port);
}
await bootstrap();
