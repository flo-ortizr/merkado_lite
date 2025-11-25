import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('reportType') reportType: string,
    @Query('metric') metric: string
  ) {
    return this.reportService.generateReport({ startDate, endDate, reportType, metric });
  }
}
