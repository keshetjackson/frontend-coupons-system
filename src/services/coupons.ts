import { withDelay } from "../lib/react-query";
import { CouponInput } from "../types/coupon";

const API_URL = process.env.API_URL || 'http://localhost:3001';


export const couponService = {
  getAll: () => 
    withDelay(
      fetch(`${API_URL}/coupons`).then(res => res.json())
    ),

  getById: (id: string) =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`).then(res => res.json())
    ),

  create: (data: CouponInput) =>
    withDelay(
      fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json())
    ),

  update: (id: string, data: Partial<CouponInput>) =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json())
    ),

  delete: (id: string) =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
      }).then(res => res.json())
    ),
};