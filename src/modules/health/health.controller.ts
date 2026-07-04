import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { timestamp } from 'rxjs';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthCheckService, private readonly prisma: PrismaService ) {     
     }
    @Get()
    @HealthCheck()
    async check() {
        await this.prisma.$queryRaw`SELECT 1`;

        return {
            status: 'ok',
            database: 'connected',
            timestamp: Date.now(),
        };
    }
}
