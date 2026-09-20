import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { SkipEnvelope } from './common/decorators/skip-envelope.decorator.js';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @SkipEnvelope()
    getHello(): string {
        return this.appService.getHello();
    }
}
