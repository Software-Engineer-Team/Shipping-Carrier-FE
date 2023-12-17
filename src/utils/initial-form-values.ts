export const initialFormCreateOrder = {
  carrier: '',
  cash_on_delivery: 0,
  from_address: '',
  from_name: '',
  from_phone_number: '',
  has_insurance: false,
  parcel_value: 0,
  payment_type_id: 1,
};

export const initialFormCreateAddress = {
  from_address: '',
  from_district: '',
  from_district_code: '',
  from_name: '',
  from_phone_number: '',
  from_province: '',
  from_province_code: '',
  from_ward: '',
  from_ward_code: '',
};

export const initialFormCreatePriceSheet = [
  {
    different_zone_purchase_price: 0,
    different_zone_sale_price: 0,
    different_zone_step_price: 0,
    from_weight: 0,
    same_province_purchase_price: 0,
    same_province_sale_price: 0,
    same_province_step_price: 0,
    same_zone_purchase_price: 0,
    same_zone_sale_price: 0,
    same_zone_step_price: 0,
    to_weight: 0,
  },
];
