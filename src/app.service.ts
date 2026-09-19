import { Get, Injectable } from '@nestjs/common';
import { SkipEnvelope } from './common/decorators/skip-envelope.decorator.js';

@Injectable()
export class AppService {
    @SkipEnvelope()
    @Get('health')
    checkHealth(): string {
        return 'OK';
    }
}
