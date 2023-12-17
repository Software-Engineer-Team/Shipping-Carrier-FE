import { IResourceComponentsProps } from '@refinedev/core';

import { AdminCreateOrder } from './create-order/admin-create-order';
import { CustomerCreateOrder } from './create-order/customer-create-order';

export const OrdersCreate: React.FC<IResourceComponentsProps> = () => {
  const role = localStorage.getItem('role') || 'customer';
  if (role === 'customer') {
    return <CustomerCreateOrder />;
  } else {
    return <AdminCreateOrder />;
  }
};
