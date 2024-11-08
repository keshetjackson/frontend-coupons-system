import { withDelay } from "../lib/react-query";
import { Coupon, CouponInput } from "../types/coupon";
import { ApiResponse } from "../types/api";

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const couponService = {
  getAll: (): Promise<ApiResponse<Coupon[]>> => 
    withDelay(
      fetch(`${API_URL}/coupons`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch coupons');
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupons fetched successfully',
          success: true
        }))
    ),

  getById: (id: string): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch coupon with id ${id}`);
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon fetched successfully',
          success: true
        }))
    ),

  create: (data: CouponInput): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to create coupon');
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon created successfully',
          success: true
        }))
    ),

  update: (id: string, data: Partial<CouponInput>): Promise<ApiResponse<Coupon>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error(`Failed to update coupon with id ${id}`);
          return res.json();
        })
        .then(data => ({
          data,
          message: 'Coupon updated successfully',
          success: true
        }))
    ),

  delete: (id: string): Promise<ApiResponse<null>> =>
    withDelay(
      fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error(`Failed to delete coupon with id ${id}`);
          return res.json();
        })
        .then(() => ({
          data: null,
          success: true,
          message: 'Coupon deleted successfully'
        }))
    ),
};
