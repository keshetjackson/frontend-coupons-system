import { withDelay } from '../lib/react-query';
import type { Coupon } from './coupons';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export interface CouponApplication {
  id: string;
  couponId: string;
  usedAt: string;
  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export const couponUsageService = {
  apply: async (coupon: Coupon, orderAmount: number): Promise<CouponApplication> =>
    withDelay(
      Promise.all([
        // Record usage
        fetch(`${API_URL}/coupon_usage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            couponId: coupon.id,
            usedAt: new Date().toISOString(),
            orderAmount,
            discountAmount: coupon.discountType === 'percentage' 
              ? (orderAmount * coupon.discountValue) / 100 
              : coupon.discountValue,
            finalAmount: orderAmount - (coupon.discountType === 'percentage' 
              ? (orderAmount * coupon.discountValue) / 100 
              : coupon.discountValue),
          }),
        }).then(res => res.json()),
        
        // Update coupon usage count
        fetch(`${API_URL}/coupons/${coupon.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentUsage: coupon.currentUsage + 1
          }),
        })
      ]).then(([usage]) => usage)
    ),

  getByDate: async (startDate: string, endDate: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_usage?usedAt_gte=${startDate}&usedAt_lte=${endDate}`)
        .then(res => res.json())
    ),

  getByCouponId: async (couponId: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_usage?couponId=${couponId}`)
        .then(res => res.json())
    ),
};