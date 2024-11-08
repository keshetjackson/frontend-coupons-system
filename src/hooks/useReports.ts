import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reports';

export function useReports() {
  return {
    couponUsage: (couponId: string) => 
      useQuery({
        queryKey: ['reports', 'usage', couponId],
        queryFn: () => reportService.getCouponUsage(couponId),
        enabled: !!couponId,
      }),

    dailyReports: (startDate: string, endDate: string) =>
      useQuery({
        queryKey: ['reports', 'daily', startDate, endDate],
        queryFn: () => reportService.getDailyReports(startDate, endDate),
        enabled: !!startDate && !!endDate,
      }),

    analytics: useQuery({
      queryKey: ['reports', 'analytics'],
      queryFn: reportService.getCouponAnalytics,
    }),
  };
}