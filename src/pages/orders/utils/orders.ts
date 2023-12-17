import { CrudFilters } from '@refinedev/core/dist/interfaces';
import dayjs from 'dayjs';
import QRCode from 'qrcode';

import { IAddress, IOrder } from '../../../interfaces/types';
import { ColumnConfig, getDateOrders } from '../../../utils';
import { IAdminSearchOrder } from '../components/admin-search-form';
import { ISearchCustomerOrder } from '../components/customer-search-form';

export const initFilters: CrudFilters = [
  {
    field: 'createdAt',
    operator: 'gte',
    value: dayjs().startOf('day').toISOString(),
  },
  {
    field: 'createdAt',
    operator: 'lte',
    value: dayjs().endOf('day').toISOString(),
  },
];

export const onCustomerSearchOrder = (params: ISearchCustomerOrder): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { carrier, createdAt, end_date, status, to_phone_number, tracking_id } = params;
  if (tracking_id) {
    filters.push({
      field: 'tracking_id',
      operator: 'contains',
      value: tracking_id,
    });
  }
  if (to_phone_number) {
    filters.push({
      field: 'to_phone_number',
      operator: 'contains',
      value: to_phone_number,
    });
  }
  if (status) {
    filters.push({
      field: 'status',
      operator: 'eq',
      value: status,
    });
  }
  if (carrier) {
    filters.push({
      field: 'carrier.name',
      operator: 'eq',
      value: carrier,
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
  if (end_date) {
    const [from, to] = getDateOrders(end_date);
    filters.push({
      field: 'end_date',
      operator: 'gte',
      value: from.toISOString(),
    });
    filters.push({
      field: 'end_date',
      operator: 'lte',
      value: to.toISOString(),
    });
  }
  return filters;
};

export const onAdminSearchOrder = (params: IAdminSearchOrder): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { carrier, createdAt, customer, end_date, is_reconciled, status, to_phone_number, tracking_id } = params;
  if (tracking_id) {
    filters.push({
      field: 'tracking_id',
      operator: 'contains',
      value: tracking_id,
    });
  }
  if (to_phone_number) {
    filters.push({
      field: 'to_phone_number',
      operator: 'contains',
      value: to_phone_number,
    });
  }
  if (status) {
    filters.push({
      field: 'status',
      operator: 'eq',
      value: status,
    });
  }
  if (is_reconciled) {
    filters.push({
      field: 'is_reconciled',
      operator: 'eq',
      value: true,
    });
  } else {
    filters.push({
      field: 'is_reconciled',
      operator: 'eq',
      value: false,
    });
  }
  if (carrier) {
    filters.push({
      field: 'carrier.name',
      operator: 'eq',
      value: carrier,
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
  if (end_date) {
    const [from, to] = getDateOrders(end_date);
    filters.push({
      field: 'end_date',
      operator: 'gte',
      value: from.toISOString(),
    });
    filters.push({
      field: 'end_date',
      operator: 'lte',
      value: to.toISOString(),
    });
  }
  return filters;
};

export const getMessageTooltips = (type: string) => {
  switch (type) {
    case 'parcel_value':
      return (
        'Giá trị hàng là căn cứ xác định giá trị bồi thường nếu xảy ra sự cố. Nếu có bảo hiểm thì phí bảo hiểm sẽ được tính như sau: ' +
        '\nGiá trị hàng hoá < 1.000.000đ: Miễn phí ' +
        '\nGiá trị hàng hoá >= 1.000.000đ (tối đa là 20.000.000đ): Phí bảo hiểm là 0.5% giá trị hàng'
      );
    case 'total_fee':
      return 'Cước vận chuyển + Phí bảo hiểm (nếu có)';
    default:
      return '';
  }
};

export const generateQrCode = async (order: IOrder) => {
  if (order?.carrier?.name === 'GHTK') {
    const tracking = order.tracking_id.match(/\d{10}$/)?.[0];
    return await QRCode.toDataURL(tracking || order.tracking_id);
  }
  return await QRCode.toDataURL(order.tracking_id);
};

export const generateBarCode = async (order: IOrder) => {
  try {
    if (order?.carrier?.name === 'GHTK') {
      const tracking = order.tracking_id.match(/\d{10}$/)?.[0];
      const res = await fetch(`https://barcodeapi.org/api/code128/${tracking || order.tracking_id}`);
      const imageBlob = await res.blob();
      return URL.createObjectURL(imageBlob);
    }
    const res = await fetch(`https://barcodeapi.org/api/code128/${order.tracking_id}`);
    const imageBlob = await res.blob();
    return URL.createObjectURL(imageBlob);
  } catch (e) {
    console.error(e);
  }
};
export const getFullAddressInfo = (address: IAddress) => {
  return [address.from_name, address.from_phone_number, address.from_address, address.from_ward, address.from_district, address.from_province].join(', ');
};

export const getFullAddressInfoFromOrder = (order: IOrder, isFrom: boolean) => {
  if (isFrom) {
    return [order.from_name, order.from_phone_number, order.from_address, order.from_ward, order.from_district, order.from_province].join(', ');
  } else {
    return [order.to_name, order.to_phone_number, order.to_address, order.to_ward, order.to_district, order.to_province].join(', ');
  }
};
export interface IOrderExportColumnsAdmin {
  id: number;
  tracking_id: string;
  is_partial_returned: string;
  carrier: string;
  carrier_account: string;
  customer: string;
  sale: string;
  status: string;
  from_name: string;
  from_phone_number: string;
  from_address: string;
  from_ward: string;
  from_district: string;
  from_province: string;
  to_name: string;
  to_phone_number: string;
  to_address: string;
  to_ward: string;
  to_district: string;
  to_province: string;
  delivery_instructions: string;
  merchant_order_number: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  product_name: string;
  parcel_value: number;
  cash_on_delivery: number;
  shipment_fee: number;
  insurance_fee: number;
  return_fee: number;
  createdAt: string;
  updatedAt: string;
  end_date: string;
  payment_type: string;
  has_insurance: string;
  reconciliationStatus: string;
}

export const columnsExportOrderByAdmin: ColumnConfig<IOrderExportColumnsAdmin>[] = [
  { key: 'id', label: 'ID' },
  { key: 'tracking_id', label: 'Mã đơn hàng' },
  { key: 'is_partial_returned', label: 'Đơn giao một phần' },
  { key: 'carrier', label: 'Vận chuyển' },
  { key: 'carrier_account', label: 'Tài khoản vận chuyển' },
  { key: 'customer', label: 'Khách hàng' },
  { key: 'sale', label: 'Sale' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'from_name', label: 'Tên người gửi' },
  { key: 'from_phone_number', label: 'Số điện thoại người gửi' },
  { key: 'from_address', label: 'Địa chỉ người gửi' },
  { key: 'from_ward', label: 'Phường/Xã người gửi' },
  { key: 'from_district', label: 'Quận/Huyện người gửi' },
  { key: 'from_province', label: 'Tỉnh/Thành người gửi' },
  { key: 'to_name', label: 'Tên người nhận' },
  { key: 'to_phone_number', label: 'Số điện thoại người nhận' },
  { key: 'to_address', label: 'Địa chỉ người nhận' },
  { key: 'to_ward', label: 'Phường/Xã người nhận' },
  { key: 'to_district', label: 'Quận/Huyện người nhận' },
  { key: 'to_province', label: 'Tỉnh/Thành người nhận' },
  { key: 'delivery_instructions', label: 'Hướng dẫn giao hàng' },
  { key: 'merchant_order_number', label: 'Mã đơn hàng riêng' },
  { key: 'weight', label: 'Khối lượng (kg)' },
  { key: 'height', label: 'Chiều cao (cm)' },
  { key: 'width', label: 'Chiều rộng (cm)' },
  { key: 'length', label: 'Chiều dài (cm)' },
  { key: 'product_name', label: 'Tên sản phẩm' },
  { key: 'parcel_value', label: 'Giá trị hàng hoá (VNĐ)' },
  { key: 'cash_on_delivery', label: 'Tiền thu hộ (VNĐ)' },
  { key: 'shipment_fee', label: 'Phí giao hàng (VNĐ)' },
  { key: 'insurance_fee', label: 'Phí bảo hiểm (VNĐ)' },
  { key: 'return_fee', label: 'Phí hoàn (VNĐ)' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'updatedAt', label: 'Ngày cập nhật' },
  { key: 'end_date', label: 'Ngày giao hàng' },
  { key: 'payment_type', label: 'Hình thức thanh toán' },
  { key: 'has_insurance', label: 'Có bảo hiểm' },
  { key: 'reconciliationStatus', label: 'Trạng thái đối soát' },
];

export const normalizeDataExportOrder = (orders: IOrder[]): IOrderExportColumnsAdmin[] => {
  return orders.map(data => {
    return {
      carrier: data.carrier.name,
      carrier_account: data.carrier_account.account_name,
      cash_on_delivery: data.cash_on_delivery,
      createdAt: dayjs(data.createdAt).format('DD-MM-YYYY'),
      customer: data.customer.username,
      delivery_instructions: data.delivery_instructions,
      end_date: dayjs(data.end_date).format('DD-MM-YYYY'),
      from_address: data.from_address,
      from_district: data.from_district,
      from_name: data.from_name,
      from_phone_number: data.from_phone_number,
      from_province: data.from_province,
      from_ward: data.from_ward,
      has_insurance: Number(data.has_insurance) === 1 ? 'Có' : 'Không',
      height: data.height,
      id: data.id,
      insurance_fee: data.insurance_fee,
      is_partial_returned: data.is_partial_returned ? 'Có' : 'Không',
      length: data.length,
      merchant_order_number: data.merchant_order_number,
      parcel_value: data.parcel_value,
      payment_type: Number(data.payment_type_id) === 1 ? 'Shop trả ship' : 'Khách trả ship',
      product_name: data.product_name,
      reconciliationStatus: data.is_reconciled ? 'Đã đối soát' : 'Chưa đối soát',
      return_fee: data.return_fee,
      sale: data.customer.sale.username,
      shipment_fee: data.shipment_fee,
      status: data.status,
      to_address: data.to_address,
      to_district: data.to_district,
      to_name: data.to_name,
      to_phone_number: data.to_phone_number,
      to_province: data.to_province,
      to_ward: data.to_ward,
      tracking_id: data.tracking_id,
      updatedAt: dayjs(data.updatedAt).format('DD-MM-YYYY'),
      weight: data.weight,
      width: data.width,
    };
  });
};
