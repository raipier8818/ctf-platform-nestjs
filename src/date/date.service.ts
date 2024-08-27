import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class DateService {
  getCurrentDate(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }

  dateToString(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }

  stringToDate(date: string): Date {
    return dayjs(date).toDate();
  }
}