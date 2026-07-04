import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) {}

    @Get('statistics')
    statistics(){
        return this.dashboardService.statistics()
    }

    @Get('completion')
    completion(){
        return this.dashboardService.completion()
    }

    @Get('pending')
    pending() {
        return this.dashboardService.getMostPending();    
    }

    @Get('latest-submissions')
    latestSubmissions() {
        return this.dashboardService.latestSubmissions();    
        }
    
}
