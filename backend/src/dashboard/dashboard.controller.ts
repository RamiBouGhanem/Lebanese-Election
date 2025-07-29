import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('مندوب')
  @Get('representative')
  getRepresentativeDashboard() {
    return { message: 'Welcome Representative Dashboard' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('رئيس قلم')
  @Get('pollinghead')
  getPollingHeadDashboard() {
    return { message: 'Welcome Polling Head Dashboard' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('مندوب', 'رئيس قلم')
  @Get('shared-reports')
  getSharedReports() {
    return { message: 'Shared Reports accessible by both roles' };
  }
}
