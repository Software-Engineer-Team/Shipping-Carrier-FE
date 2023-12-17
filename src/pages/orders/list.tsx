import { IResourceComponentsProps } from '@refinedev/core';

import { AdminListOrder } from './list-order/admin-list-order';
import { CustomerListOrder } from './list-order/customer-list-order';

export const OrdersList: React.FC<IResourceComponentsProps> = () => {
  const role = localStorage.getItem('role') || 'customer';
  if (role === 'customer') {
    return <CustomerListOrder />;
  } else {
    return <AdminListOrder />;
  }
};
