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