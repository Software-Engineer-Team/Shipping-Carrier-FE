import { IOrder, OrderStatus } from '../interfaces/types';

export const transformHeaderOrder = (header: string, index: number) => {
  switch (index) {
    case 0:
      return 'to_name';
    case 1:
      return 'to_phone_number';
    case 2:
      return 'to_province';
    case 3:
      return 'to_district';
    case 4:
      return 'to_ward';
    case 5:
      return 'to_address';
    case 6:
      return 'product_name';
    case 7:
      return 'parcel_value';
    case 8:
      return 'merchant_order_number';
    case 9:
      return 'cash_on_delivery';
    case 10:
      return 'has_insurance';
    case 11:
      return 'weight';
    case 12:
      return 'payment_type_id';
    case 13:
      return 'delivery_instructions';
    default:
      return header.toLowerCase().trim();
  }
};

export const transformHeaderReconciliation = (header: string, index: number) => {
  switch (index) {
    case 0:
      return 'tracking_id';
    case 1:
      return 'shipment_fee';
    case 2:
      return 'cost_on_delivery';
    case 3:
      return 'status';
    case 4:
      return 'successful_delivery_date';
    case 5:
      return 'created_order_date';
    case 6:
      return 'carrier_weight';
    case 7:
      return 'return_fee';
    case 8:
      return 'insurance_fee';
    default:
      return header.toLowerCase().trim();
  }
};

export const checkCanCancel = (order?: IOrder) => {
  if (!order) {
    return false;
  }
  if (order.deleted) {
    return false;
  }
  if (order.status === OrderStatus.PENDING_PICKUP) return true;
  else return false;
};

export const calculateFinalWeight = (width: number, length: number, height: number, weight: number): number => {
  const dimensionsToWeight = (height * width * length) / 6000;
  return weight > dimensionsToWeight ? weight : dimensionsToWeight;
};
