import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { couponUsageService } from '../services/couponUsage';
import { Coupon } from '../types/coupon';


export function useCouponUsage() {
  const queryClient = useQueryClient();

  return {
    applyCoupon: useMutation({
      mutationFn: ({ coupon, amount }: { coupon: Coupon; amount: number }) =>
        couponUsageService.apply(coupon, amount),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
        queryClient.invalidateQueries({ queryKey: ['coupon_usage'] });
      },
    }),

    getUsageHistory: (startDate: string, endDate: string) =>
      useQuery({
        queryKey: ['coupon_usage', 'history', startDate, endDate],
        queryFn: () => couponUsageService.getByDate(startDate, endDate),
        enabled: !!startDate && !!endDate,
      }),

    getCouponUsage: (couponId: string) =>
      useQuery({
        queryKey: ['coupon_usage', couponId],
        queryFn: () => couponUsageService.getByCouponId(couponId),
        enabled: !!couponId,
      }),
  };
}