import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { withDelay } from '../lib/react-query';

const API_URL = process.env.API_URL || 'http://localhost:3001';

interface CouponCombination {
  id: string;
  couponId1: string;
  couponId2: string;
  isAllowed: boolean;
}

// Simple API calls directly in the hook file
const combinationsApi = {
  getAllowed: (couponId: string) =>
    withDelay(
      fetch(`${API_URL}/coupon_combinations?couponId1=${couponId}&isAllowed=true`)
        .then(res => res.json()) as Promise<CouponCombination[]>
    ),

  setAllowed: (couponId1: string, couponId2: string, isAllowed: boolean) =>
    withDelay(
      fetch(`${API_URL}/coupon_combinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponId1,
          couponId2,
          isAllowed
        })
      }).then(res => res.json()) as Promise<CouponCombination>
    ),
};

export function useCouponCombinations() {
  const queryClient = useQueryClient();

  return {
    getAllowed: (couponId: string) =>
      useQuery({
        queryKey: ['coupon_combinations', couponId],
        queryFn: () => combinationsApi.getAllowed(couponId),
        enabled: !!couponId,
      }),

    setAllowed: useMutation({
      mutationFn: ({ couponId1, couponId2, isAllowed }: {
        couponId1: string;
        couponId2: string;
        isAllowed: boolean;
      }) => combinationsApi.setAllowed(couponId1, couponId2, isAllowed),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coupon_combinations'] });
      },
    }),
  };
}