import { IsDateString, IsNumber } from 'class-validator';

export class ScheduleDeliveryDto {
  @IsNumber()
  id_order: number;

  @IsDateString()
  scheduled_date: string;
}
