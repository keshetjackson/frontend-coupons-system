import { useMutation } from '@tanstack/react-query';

interface ExportParams {
  startDate: string;
  endDate: string;
}

const API_URL = import.meta.env.API_URL || 'http://localhost:3001';
// Helper function to trigger file download
const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const exportService = {
  exportCoupons: async ({ startDate, endDate }: ExportParams) => {
    const response = await fetch(`${API_URL}/reports/export/coupons?startDate=${startDate}&endDate=${endDate}`);
    const blob = await response.blob();
    downloadFile(blob, `coupons-report-${startDate}-${endDate}.xlsx`);
  },

  exportUsage: async ({ startDate, endDate }: ExportParams) => {
    const response = await fetch(`${API_URL}/reports/export/usage?startDate=${startDate}&endDate=${endDate}`);
    const blob = await response.blob();
    downloadFile(blob, `usage-report-${startDate}-${endDate}.xlsx`);
  }
};

export function useExport() {
  return {
    exportCoupons: useMutation({
      mutationFn: exportService.exportCoupons,
    }),

    exportUsage: useMutation({
      mutationFn: exportService.exportUsage,
    })
  };
}