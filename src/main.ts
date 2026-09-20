import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });

    app.setGlobalPrefix('api', {
        exclude: ['health/(.*)', 'health'],
    });

    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const reflector = app.get(Reflector);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

    const config = new DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('Production-grade NestJS REST API with Typed Contracts')
        .setVersion('1.0')
        .addTag('Tasks', 'Task lifecycle and operations')
        .addTag('Health', 'Kubernetes & Docker liveness/readiness probes')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        useGlobalPrefix: true,
    });

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    await app.listen(port);
}
await bootstrap();
