import { useMutation } from '@tanstack/react-query';
import { withDelay } from '../lib/react-query';
import type { Coupon } from '../services/coupons';

const API_URL = process.env.API_URL || 'http://localhost:3001';
interface ValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
}

// Validation logic directly in the hook file
const validateCoupon = async (code: string, orderAmount: number = 100): Promise<ValidationResult> =>
  withDelay(
    fetch(`${API_URL}/coupons?code=${code}&isActive=true`)
      .then(res => res.json())
      .then((coupons: Coupon[]) => {
        const coupon = coupons[0];
        if (!coupon) {
          return { isValid: false, error: 'Invalid coupon code' };
        }

        // Validate expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
          return { isValid: false, error: 'Coupon has expired' };
        }

        // Validate usage limit
        if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
          return { isValid: false, error: 'Coupon usage limit reached' };
        }

        // Calculate discount
        const discountAmount = coupon.discountType === 'percentage' 
          ? (orderAmount * coupon.discountValue) / 100
          : coupon.discountValue;

        return {
          isValid: true,
          coupon,
          discountAmount,
          finalAmount: orderAmount - discountAmount
        };
      })
  );

const validateMultipleCoupons = async (codes: string[], orderAmount: number = 100): Promise<ValidationResult> =>
  withDelay(
    fetch(`${API_URL}/coupons?${codes.map(code => `code=${code}`).join('&')}&isActive=true`)
      .then(res => res.json())
      .then(async (coupons: Coupon[]) => {
        // Check if all coupons exist
        if (coupons.length !== codes.length) {
          return { isValid: false, error: 'One or more invalid coupon codes' };
        }

        // Check if coupons can be stacked
        const nonStackableCoupons = coupons.filter((coupon: Coupon) => !coupon.allowStacking);
        if (nonStackableCoupons.length > 1) {
          return { isValid: false, error: 'These coupons cannot be combined' };
        }

        // Calculate total discount
        let finalAmount = orderAmount;
        let totalDiscount = 0;

        for (const coupon of coupons) {
          const validation = await validateCoupon(coupon.code, finalAmount);
          if (!validation.isValid) {
            return validation;
          }
          
          totalDiscount += validation.discountAmount!;
          finalAmount = validation.finalAmount!;
        }

        return {
          isValid: true,
          discountAmount: totalDiscount,
          finalAmount
        };
      })
  );

export function useCouponValidator() {
  return {
    validateCoupon: useMutation({
      mutationFn: ({ code, amount }: { code: string; amount?: number }) =>
        validateCoupon(code, amount),
    }),

    validateMultipleCoupons: useMutation({
      mutationFn: ({ codes, amount }: { codes: string[]; amount?: number }) =>
        validateMultipleCoupons(codes, amount),
    }),
  };
}