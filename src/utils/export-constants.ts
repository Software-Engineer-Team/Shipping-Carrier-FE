import { IBankAccount, IOrder, IProfit, IReconciliationOrder, IUser } from '../interfaces/types';
import { ColumnConfig } from './export-to-excel';

export const columnsExportOrderByCustomer: ColumnConfig<IOrder>[] = [
  { key: 'tracking_id', label: 'Mã đơn hàng' },
  { key: 'carrier.name', label: 'Nhà vận chuyển' },
  { key: 'customer.username', label: 'Tên shop' },
  { key: 'customer.sale.username', label: 'Sale' },
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
  { key: 'product_name', label: 'Tên sản phẩm' },
  { key: 'delivery_instructions', label: 'Hướng dẫn giao hàng' },
  { key: 'merchant_order_number', label: 'Mã đơn hàng riêng' },
  { key: 'weight', label: 'Khối lượng (kg)' },
  { key: 'cash_on_delivery', label: 'Tiền thu hộ (VNĐ)' },
  { key: 'parcel_value', label: 'Giá trị hàng hoá (VNĐ)' },
  { key: 'shipment_fee', label: 'Phí giao hàng (VNĐ)' },
  { key: 'return_fee', label: 'Phí hoàn (VNĐ)' },
  { key: 'insurance_fee', label: 'Phí bảo hiểm (VNĐ)' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'updatedAt', label: 'Ngày cập nhật' },
];

export const columnsExportCustomer: ColumnConfig<IUser>[] = [
  { key: 'id', label: 'Mã khách hàng' },
  { key: 'username', label: 'Tên khách hàng' },
  { key: 'phone_number', label: 'Số điện thoại' },
  { key: 'email', label: 'Email' },
  { key: 'sale.username', label: 'Sale' },
  { key: 'createdAt', label: 'Ngày tạo' },
];

export const columnsExportBank: ColumnConfig<IBankAccount>[] = [
  { key: 'user.id', label: 'Mã khách hàng' },
  { key: 'user.username', label: 'Tên khách hàng' },
  { key: 'bank_account_number', label: 'Số tài khoản' },
  { key: 'bank.name', label: 'Tên ngân hàng' },
  { key: 'account_holder_name', label: 'Tên người thụ hưởng' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'updatedAt', label: 'Ngày cập nhật' },
];

export const columnsExportReconciliationAdmin: ColumnConfig<IReconciliationOrder>[] = [
  { key: 'id', label: 'ID' },
  { key: 'tracking_id', label: 'Mã đơn hàng' },
  { key: 'start_date', label: 'Ngày tạo đơn' },
  { key: 'end_date', label: 'Ngày giao hàng' },
  { key: 'weight', label: 'Trọng lượng' },
  { key: 'carrier.name', label: 'Vận chuyển' },
  { key: 'status', label: 'Trạng thái' },
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
  { key: 'createdAt', label: 'Ngày đối soát' },
];

export const columnsExportReconciliationCustomer: ColumnConfig<IReconciliationOrder>[] = [
  { key: 'id', label: 'ID' },
  { key: 'tracking_id', label: 'Mã đơn hàng' },
  { key: 'start_date', label: 'Ngày tạo đơn' },
  { key: 'end_date', label: 'Ngày giao hàng' },
  { key: 'weight', label: 'Trọng lượng' },
  { key: 'carrier.name', label: 'Vận chuyển' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'system_shipment_fee', label: 'Phí vận chuyển (BSS)' },
  { key: 'system_cash_on_delivery', label: 'Phí thu hộ (BSS)' },
  { key: 'system_return_fee', label: 'Phí hoàn (BSS)' },
  { key: 'system_insurance_fee', label: 'Phí bảo hiểm (BSS)' },
  { key: 'system_change_fee', label: 'Phí thay đổi địa chỉ (BSS)' },
  { key: 'system_other_fee', label: 'Phí khác (BSS)' },
  { key: 'customer_refund', label: 'Tổng hoàn khách' },
  { key: 'createdAt', label: 'Ngày đối soát' },
];

export const columnsExportReportReconciliation = (injectedKeys: string[]): ColumnConfig<IProfit>[] => {
  const defaultKeys = [
    { key: 'customer.username', label: 'Tên khách hàng' },
    { key: 'customer.sale.username', label: 'Sale' },
    { key: 'totalOrders', label: 'Tổng đơn' },
    { key: 'totalSystemCOD', label: 'Tổng COD (BSS)' },
    { key: 'totalSystemShipmentFee', label: 'Tổng phí vận chuyển (BSS)' },
    { key: 'totalSystemReturnFee', label: 'Tổng phí hoàn (BSS)' },
    { key: 'totalSystemInsuranceFee', label: 'Tổng phí bảo hiểm (BSS)' },
    { key: 'totalSystemOtherFee', label: 'Tổng phí khác (BSS)' },
    { key: 'totalSystemChangeFee', label: 'Tổng phí thay đổi địa chỉ (BSS)' },
    { key: 'totalPartnerCOD', label: 'Tổng COD (file)' },
    { key: 'totalPartnerShipmentFee', label: 'Tổng phí vận chuyển (file)' },
    { key: 'totalPartnerReturnFee', label: 'Tổng phí hoàn (file)' },
    { key: 'totalPartnerInsuranceFee', label: 'Tổng phí bảo hiểm (file)' },
    { key: 'totalPartnerOtherFee', label: 'Tổng phí khác (file)' },
    { key: 'totalPartnerChangeFee', label: 'Tổng phí thay đổi địa chỉ (file)' },
    { key: 'totalSystemRevenue', label: 'Tổng lợi nhuận' },
    { key: 'totalCustomerRefund', label: 'Tổng hoàn khách' },
  ];
  // remove keys that are not in injectedKeys
  return defaultKeys.filter(key => !injectedKeys.includes(key.key));
};
