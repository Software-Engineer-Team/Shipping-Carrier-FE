import { CrudFilters } from '@refinedev/core/dist/interfaces';
import dayjs from 'dayjs';

import { IReconciliation } from '../../../interfaces/types';
import { ColumnConfig, getDateOrders } from '../../../utils';
import { IAdminSearchReconciliation } from '../components/AdminSearchForm';
import { ISaleSearchReconciliation } from '../components/SaleSearchForm';

export const onAdminSearchReconciliations = (params: IAdminSearchReconciliation): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { createdAt, customer, end_date, status, updatedAt } = params;

  if (status) {
    filters.push({
      field: 'status',
      operator: 'eq',
      value: status,
    });
  }

  if (customer) {
    filters.push({
      field: 'customer.id',
      operator: 'eq',
      value: customer,
    });
  }
  if (createdAt) {
    const [from, to] = getDateOrders(createdAt);
    filters.push({
      field: 'createdAt',
      operator: 'gte',
      value: from.toISOString(),
    });
    filters.push({
      field: 'createdAt',
      operator: 'lte',
      value: to.toISOString(),
    });
  }
  if (updatedAt) {
    const [from, to] = getDateOrders(updatedAt);
    filters.push({
      field: 'updatedAt',
      operator: 'gte',
      value: from.toISOString(),
    });
    filters.push({
      field: 'updatedAt',
      operator: 'lte',
      value: to.toISOString(),
    });
  }
  return filters;
};

export const onSaleSearchReconciliations = (params: ISaleSearchReconciliation): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { createdAt, customer } = params;
  if (customer) {
    filters.push({
      field: 'customer.id',
      operator: 'eq',
      value: customer,
    });
  }
  if (createdAt) {
    const [from, to] = getDateOrders(createdAt);
    filters.push({
      field: 'createdAt',
      operator: 'gte',
      value: from.toISOString(),
    });
    filters.push({
      field: 'createdAt',
      operator: 'lte',
      value: to.toISOString(),
    });
  }
  filters.push({
    field: 'status',
    operator: 'eq',
    value: 'completed',
  });
  return filters;
};

export interface IReconciliationExportColumns {
  customer: string;
  sale: string;
  id: number;
  payment_type: string;
  tracking_id: string;
  carrier: string;
  status: string;
  reconciliation_status: string;
  start_date: string;
  end_date: string;
  weight: number;
  partner_shipment_fee: number;
  partner_cash_on_delivery: number;
  partner_return_fee: number;
  partner_insurance_fee: number;
  partner_other_fee: number;
  partner_change_fee: number;
  system_shipment_fee: number;
  system_cash_on_delivery: number;
  system_return_fee: number;
  system_insurance_fee: number;
  system_change_fee: number;
  system_other_fee: number;
  customer_refund: number;
  system_revenue: number;
  createdAt: string;
  updatedAt: string;
}

export const columnsExportReconciliation: ColumnConfig<IReconciliationExportColumns>[] = [
  { key: 'tracking_id', label: 'Mã đơn hàng' },
  { key: 'customer', label: 'Khách hàng' },
  { key: 'sale', label: 'Sale' },
  { key: 'carrier', label: 'Vận chuyển' },
  { key: 'payment_type', label: 'Hình thức thanh toán' },
  { key: 'start_date', label: 'Ngày tạo đơn' },
  { key: 'end_date', label: 'Ngày giao hàng' },
  { key: 'weight', label: 'Trọng lượng' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'reconciliation_status', label: 'Trạng thái đối soát' },
  { key: 'partner_shipment_fee', label: 'Phí vận chuyển (file)' },
  { key: 'partner_cash_on_delivery', label: 'Phí thu hộ (file)' },
  { key: 'partner_return_fee', label: 'Phí hoàn (file)' },
  { key: 'partner_insurance_fee', label: 'Phí bảo hiểm (file)' },
  { key: 'partner_other_fee', label: 'Phí khác (file)' },
  { key: 'partner_change_fee', label: 'Phí thay đổi địa chỉ (file)' },
  { key: 'system_shipment_fee', label: 'Phí vận chuyển (BSS)' },
  { key: 'system_cash_on_delivery', label: 'Phí thu hộ (BSS)' },
  { key: 'system_return_fee', label: 'Phí hoàn (BSS)' },
  { key: 'system_insurance_fee', label: 'Phí bảo hiểm (BSS)' },
  { key: 'system_change_fee', label: 'Phí thay đổi địa chỉ (BSS)' },
  { key: 'system_other_fee', label: 'Phí khác (BSS)' },
  { key: 'customer_refund', label: 'Tổng hoàn khách' },
  { key: 'system_revenue', label: 'Lợi nhuận' },
  { key: 'createdAt', label: 'Ngày tạo đối soát' },
  { key: 'updatedAt', label: 'Ngày cập nhật đối soát' },
];

export const normalizeExportData = (data: IReconciliation[]) => {
  const result: IReconciliationExportColumns[] = [];
  data.forEach(item => {
    item.reconciliation_orders.forEach(order => {
      let reconciliation_status = '';
      switch (item.status) {
        case 'completed':
          reconciliation_status = 'Đã hoàn thành';
          break;
        case 'pending':
          reconciliation_status = 'Đang chờ đối soát';
          break;
        case 'cancelled':
          reconciliation_status = 'Đã hủy';
          break;
        default:
          reconciliation_status = '';
      }
      result.push({
        ...order,
        carrier: order.carrier.name,
        createdAt: dayjs(item.createdAt).format('DD-MM-YYYY'),
        customer: item.customer.username,
        end_date: dayjs(order.end_date).format('DD-MM-YYYY'),
        payment_type: order.payment_type_id === 1 ? 'Shop trả ship' : 'Khách trả ship',
        reconciliation_status: reconciliation_status,
        sale: item.customer.sale.username,
        start_date: dayjs(order.start_date).format('DD-MM-YYYY'),
        updatedAt: dayjs(item.updatedAt).format('DD-MM-YYYY'),
      });
    });
  });
  return result;
};
