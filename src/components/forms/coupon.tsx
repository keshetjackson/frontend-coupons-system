// src/components/coupons/coupon-form.tsx
import { Formik, Form, Field, FieldProps } from 'Formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Coupon, CouponInput } from "@/types/coupon";

const CouponSchema = Yup.object().shape({
  code: Yup.string()
    .required('Required')
    .min(3, 'Too Short!')
    .max(50, 'Too Long!'),
  description: Yup.string()
    .required('Required')
    .min(5, 'Too Short!')
    .max(200, 'Too Long!'),
  discountType: Yup.string()
    .oneOf(['percentage', 'fixed'], 'Invalid discount type')
    .required('Required'),
  discountValue: Yup.number()
    .required('Required')
    .positive('Must be positive')
    .when('discountType', {
      is: 'percentage',
      then: (schema) => schema.max(100, 'Percentage cannot exceed 100%'),
    }),
  expiryDate: Yup.date().nullable(),
  allowStacking: Yup.boolean().required('Required'),
  usageLimit: Yup.number().positive('Must be positive').nullable(),
});

const defaultInitialValues: CouponInput = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  expiryDate: undefined,
  allowStacking: false,
  usageLimit: undefined,
};

interface CouponFormProps {
  initialData?: Partial<CouponInput>;
  onSubmit: (values: CouponInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function CouponForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Submit' 
}: CouponFormProps) {
  return (
    <Formik
      initialValues={{
        ...defaultInitialValues,
        ...initialData
      }}
      validationSchema={CouponSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission failed:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Field
              as={Input}
              id="code"
              name="code"
              className={errors.code && touched.code ? "border-red-500" : ""}
            />
            {errors.code && touched.code && (
              <p className="text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Field
              as={Input}
              id="description"
              name="description"
              className={errors.description && touched.description ? "border-red-500" : ""}
            />
            {errors.description && touched.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Field name="discountType">
              {({ field }: FieldProps) => (
                <Select
                  onValueChange={(value) => field.onChange({
                    target: { name: 'discountType', value }
                  })}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            {errors.discountType && touched.discountType && (
              <p className="text-sm text-red-500">{errors.discountType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountValue">Discount Value</Label>
            <Field
              as={Input}
              id="discountValue"
              name="discountValue"
              type="number"
              min="0"
              className={errors.discountValue && touched.discountValue ? "border-red-500" : ""}
            />
            {errors.discountValue && touched.discountValue && (
              <p className="text-sm text-red-500">{errors.discountValue}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Field
              as={Input}
              id="expiryDate"
              name="expiryDate"
              type="datetime-local"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">Usage Limit</Label>
            <Field
              as={Input}
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Field
              as={Switch}
              id="allowStacking"
              name="allowStacking"
            />
            <Label htmlFor="allowStacking">Allow Stacking</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}