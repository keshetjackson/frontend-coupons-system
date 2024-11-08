import { withDelay } from "../lib/react-query";
import { CouponAnalytics, CouponUsage, DailyReport } from "../types/report";

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';


export const reportService = {
  getCouponUsage: async (couponId: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_usage?couponId=${couponId}`).then(res => res.json())
    ) as Promise<CouponUsage[]>,

  getDailyReports: async (startDate: string, endDate: string) =>
    withDelay(
      fetch(`${API_URL}/reports/daily_usage?date_gte=${startDate}&date_lte=${endDate}`)
        .then(res => res.json())
    ) as Promise<DailyReport[]>,

  getCouponAnalytics: async () =>
    withDelay(
      fetch(`${API_URL}/reports/coupon_analytics`).then(res => res.json())
    ) as Promise<CouponAnalytics[]>,

  exportToExcel: async (startDate: string, endDate: string) =>
    withDelay(
      fetch(`${API_URL}/reports/export?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.blob())
    ),
};