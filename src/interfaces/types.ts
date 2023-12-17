export interface IRole {
  id: number | string;
  name: string;
  description: string;
  type: string;
}

export interface IUser {
  id: number | string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: IRole;
  phone_number: string;
  address: string;
  addresses: IAddress[];
  carrier: ICarrier;
  sale: IUser;
  banks: IBankAccount[];
  createdAt: string;
  updatedAt: string;
}

export interface ICarrierPrice {
  carrier: {
    id: number;
    name: string;
  };
  price_sheets: IPriceSheet[];
}

export interface IPriceSheet {
  id: number;
  name: string;
  price_items: IPriceItem[];
  carrier: ICarrier;
  default: boolean;
}
export interface IPriceItem {
  id: number;
  from_weight: number;
  to_weight: number;
  return_fee: number;
  purchase_price: number;
  sale_price: number;
  step_price: number;
  zone_type: string;
  carrier_account: CarrierAccount;
  zone_pick: [IZonePick];
  custom: {
    weight?: number;
  };
}

export interface IZonePick {
  id: number;
  name: string;
}

export interface CarrierAccount {
  id: number;
  api_url: string;
  carrier: ICarrier;
  reminder_link: string;
  account_name: string;
}

export interface ICarrier {
  id: number;
  name: string;
  price_sheet: number;
}

export interface ICarrierAccount {
  id: number;
  api_url: string;
  carrier: ICarrier;
  account_name: string;
}

export interface IReconciliation {
  id: number;
  reconciliation_orders: IReconciliationOrder[];
  carrier: ICarrier;
  customer: IUser;
  status: string;
  note: string;
  reconciliationAt: string;
  total_customer_refund: number;
  total_system_revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReconciliationOrder {
  id: number;
  tracking_id: string;
  carrier: ICarrier;
  status: string;
  start_date: string;
  end_date: string;
  weight: number;
  payment_type_id: number;
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
  total_shipment_fee: number;
  partner_tax_fee: number;
  customer_refund: number;
  system_revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProvince {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}
export interface IProvinceCustom {
  id: number;
  province_id: string;
  name: string;
}
export interface IDistrictCustom {
  id: number;
  name: string;
  district_id: string;
  province: IProvinceCustom;
}
export interface IWardCustom {
  id: number;
  name: string;
  ward_id: string;
  district: IDistrictCustom;
}

export interface IAddress {
  id: number;
  from_name: string;
  from_phone_number: string;
  from_address: string;
  from_ward: string;
  from_ward_code: string;
  from_district: string;
  from_district_code: string;
  from_province: string;
  from_province_code: string;
  default: boolean;
}

export interface IDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  IsEnable: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: {
    From: number[] | null;
    To: number[] | null;
    Return: number[] | null;
  };
  WhiteListDistrict: {
    From: null;
    To: null;
  };
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: string[];
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}

export interface IWard {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: {
    From: number[];
    To: number[];
    Return: number[];
  };
  WhiteListWard: {
    From: null;
    To: string[] | null;
  };
  Status: number;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: string[] | null;
  UpdatedIP?: string;
  UpdatedEmployee?: number;
  UpdatedSource?: string;
  UpdatedDate: string;
}

export enum OrderStatus {
  PENDING_PICKUP = 'Đang chờ lấy hàng',
  DELIVERY_IN_PROGRESS = 'Đang vận chuyển',
  DELIVERY_FAILED = 'Vận chuyển thất bại',
  RETURN_TO_SENDER = 'Trả lại cho người gửi',
  DELIVERY_SUCCESSFUL = 'Giao hàng thành công',
  CANCEL_ORDER = 'Đơn hàng hủy',
}

export interface IOrder {
  id: number;
  from_name: string;
  from_phone_number: string;
  from_address: string;
  from_ward: string;
  from_ward_code: string;
  from_district: string;
  from_district_code: string;
  from_province: string;
  from_province_code: string;
  to_name: string;
  to_phone_number: string;
  to_address: string;
  to_ward: string;
  to_ward_code: string;
  to_district: string;
  to_district_code: string;
  to_province: string;
  to_province_code: string;
  delivery_instructions: string;
  merchant_order_number: string;
  tracking_id: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  cash_on_delivery: number;
  parcel_value: number;
  customer: IUser;
  shipment_fee: number;
  status: OrderStatus;
  carrier: ICarrier;
  reference_code: string;
  price_items: IPriceItem[];
  insurance_fee: number;
  return_fee: number;
  deleted: boolean;
  product_name: string;
  createdAt: Date;
  updatedAt: Date;
  end_date: Date;
  payment_type_id: number;
  has_insurance: number;
  is_reconciled: boolean;
  carrier_account: CarrierAccount;
  is_partial_returned: boolean;
}

export interface StatusReportDetail {
  totalCOD: number;
  totalShipmentFee: number;
  orderIds: number[];
}
export interface ReportOrderByStatus {
  pending_pickup?: StatusReportDetail;
  delivery_in_progress?: StatusReportDetail;
  delivery_failed?: StatusReportDetail;
  return_to_sender?: StatusReportDetail;
  delivery_successful?: StatusReportDetail;
  cancel_order?: StatusReportDetail;
}

export interface ReportOrderByCustomer {
  customer: IUser;
  reportOrdersByStatus: ReportOrderByStatus;
}

export interface ReportResponse {
  data: {
    ordersByCustomer: ReportOrderByCustomer[];
    totalReceivedOrders?: number;
    totalReceivedOrdersCOD?: number;
    totalReceivedOrdersShipmentFee?: number;
    totalCreatedOrdersShipmentFee?: number;
    totalCreatedOrdersCOD?: number;
    totalCreatedOrders?: number;
    totalPendingPickupOrdersShipmentFee?: number;
    totalPendingPickupOrdersCOD?: number;
    totalPendingPickupOrders?: number;
    totalDeliverySuccessfulOrdersShipmentFee?: number;
    totalDeliverySuccessfulOrdersCOD?: number;
    totalDeliverySuccessfulOrders?: number;
    totalReportOrdersByStatus?: ReportOrderByStatus;
  };
}

export interface IProfit {
  customer: IUser;
  totalOrders: number;
  totalSystemCOD: number;
  totalSystemShipmentFee: number;
  totalSystemInsuranceFee: number;
  totalSystemOtherFee: number;
  totalSystemChangeFee: number;
  totalSystemReturnFee: number;
  totalPartnerCOD: number;
  totalPartnerShipmentFee: number;
  totalPartnerInsuranceFee: number;
  totalPartnerOtherFee: number;
  totalPartnerChangeFee: number;
  totalPartnerReturnFee: number;
  totalSystemRevenue: number;
  totalCustomerRefund: number;
}
export interface IReportReconciliation {
  data: {
    profits: IProfit[];
    totalProfitReport: IProfit;
  };
}

export interface ITracking {
  id: string;
  tracking_id: string;
  createdAt: Date;
  status: string;
  description: string;
  weight: number;
}
export interface ITrackingResponse {
  data: {
    order: IOrder;
    trackings: ITracking[];
  };
}

export interface IBankAccount {
  id: number;
  bank_account_number: string;
  bank: IBank;
  account_holder_name: string;
  createdAt: string;
  user: IUser;
}
export interface IBank {
  id: number;
  name: string;
}

export interface IBankCustom {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  code: string;
  bin: string;
}
