import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { SkipEnvelope } from '../common/decorators/skip-envelope.decorator.js';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
    ) {}

    @Get('liveness')
    @SkipEnvelope()
    @HealthCheck()
    checkLiveness() {
        return this.health.check([() => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024)]);
    }

    @Get('readiness')
    @SkipEnvelope()
    @HealthCheck()
    checkReadiness() {
        return this.health.check([() => this.db.pingCheck('database').withTimeout(3000)]);
    }
}
