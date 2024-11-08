import  { useState } from "react";
import {  FileDown, Edit, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useCoupons } from "@/hooks/useCoupons";
import { useExport } from "@/hooks/useExport";
import { Coupon } from "@/types/coupon";
import { CouponForm } from "@/components/forms/coupon";

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { coupons, createCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const { exportCoupons } = useExport();

  const filteredCoupons =
    coupons.data?.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(search.toLowerCase()) ||
        coupon.description.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const handleExport = async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    await exportCoupons.mutateAsync({
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
    });
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            create coupon
          </Button>
          
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
              </DialogHeader>
              <CouponForm
                onSubmit={async (values) => {
                  await createCoupon.mutateAsync(values);
                  setIsCreateDialogOpen(false);
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
                submitLabel="Create Coupon"
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Coupon</DialogTitle>
              </DialogHeader>
              {selectedCoupon && (
                <CouponForm
                  initialData={selectedCoupon}
                  onSubmit={async (values) => {
                    await updateCoupon.mutateAsync({
                      id: selectedCoupon.id,
                      data: values,
                    });
                    setIsEditDialogOpen(false);
                  }}
                  onCancel={() => setIsEditDialogOpen(false)}
                  submitLabel="Save Changes"
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.discountType}</TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₪${coupon.discountValue}`}
                  </TableCell>
                  <TableCell>
                    {coupon.usageLimit
                      ? `${coupon.currentUsage}/${coupon.usageLimit}`
                      : coupon.currentUsage}
                  </TableCell>
                  <TableCell>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {handleEdit(coupon)}}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCoupon.mutate(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
