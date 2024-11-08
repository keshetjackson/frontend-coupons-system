import { withDelay } from "../lib/react-query";

const API_URL = process.env.API_URL || 'http://localhost:3001';
export interface CouponUsage {
  id: string;
  couponId: string;
  usedAt: string;
  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface DailyReport {
  id: string;
  date: string;
  totalOrders: number;
  totalDiscount: number;
  averageDiscount: number;
}

export interface CouponAnalytics {
  id: string;
  couponId: string;
  totalUsage: number;
  totalDiscount: number;
  averageOrderValue: number;
  conversionRate: number;
}

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