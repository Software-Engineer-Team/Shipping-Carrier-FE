export enum APIEndPoint {
  USERS = 'users',
  AUTH_CHANGE_PASSWORD = 'auth/change-password',

  CREATE_ORDER_ADMIN = 'v1/orders/admin',
  CREATE_ORDER_CUSTOMER = 'v1/orders/customer',
  ORDERS = 'v1/orders',
  ORDERS_PARTIAL = 'v1/orders/createPartialOrder',
  ORDERS_ADMIN = 'v1/orders/admin',
  ORDERS_CUSTOMER = 'v1/orders/customer',
  ORDERS_UPLOAD = 'v1/orders/upload',
  ORDERS_PARSE = 'v1/address/parse',
  ORDERS_DELETE = 'v1/orders',
  ORDERS_AIRWAY_BILL = '/v1/orders/waybill',

  RECONCILIATIONS = 'v1/reconciliations',
  RECONCILIATIONS_CREATE_MANY = 'v1/reconciliations/createMany',
  RECONCILIATIONS_PROFIT = 'v1/reconciliations/profit',
  RECONCILIATIONS_ADMIN = 'v1/reconciliations/admin',
  RECONCILIATIONS_CUSTOMER = 'v1/reconciliations/customer',
  CANCEL_RECONCILIATION = 'v1/reconciliations/cancel',
  CONFIRM_RECONCILIATION = 'v1/reconciliations/confirm',
  CONFIRM_MANY_RECONCILIATION = 'v1/reconciliations/confirms',
  UPLOAD_RECONCILIATION = 'v1/reconciliations/upload',

  RECONCILIATION_ORDERS_UPLOAD = 'v1/reconciliationOrders/upload',
  RECONCILIATION_ORDERS = 'v1/reconciliationOrders',
  RECONCILIATION_ORDERS_GROUP_BY_CUSTOMER = 'v1/reconciliationOrders/groupByCustomer',

  UPLOAD_FILE = 'upload',

  PRICE_SHEETS = 'v1/priceSheets',
  PRICE_SHEET = 'v1/priceSheet',
  CARRIER_ACCOUNT = 'v1/carrierAccounts',

  USER_PRICE_SHEETS = 'v1/userPriceSheets',
  USER_PRICE_SHEETS_BY_CUSTOMER = 'v1/userPriceSheets/groupByCustomer',

  SHIPMENT_FEE = '/v1/userPriceSheets/calculateShipmentFees',

  REPORT = 'v1/report',
  REPORT_CUSTOMER = 'v1/report/customer',
  REPORT_ADMIN = 'v1/report/admin',

  ADDRESS_PROVINCE = 'v1/address/province',
  ADDRESS_DISTRICT = 'v1/address/district',
  ADDRESS_WARD = 'v1/address/ward',
  ADDRESS_DETAIL = 'v1/address/searchDetail',

  PROVINCE = 'v1/provinces',
  DISTRICT = 'v1/districts',
  WARD = 'v1/wards',

  CARRIERS = 'v1/carriers',

  TRACKINGS = 'v1/trackings',

  ADDRESSES = 'v1/addresses',

  BANKS = 'v1/banks',
  BANK_ACCOUNTS = 'v1/bankAccounts',
  BANKS_CUSTOM = 'v1/customBanks',
}
