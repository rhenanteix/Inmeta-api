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

  @Get('pending')
pending() {
    return this.dashboardService.getMostPending();

    
}
    
}
