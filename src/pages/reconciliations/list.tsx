import { IResourceComponentsProps, GetListResponse } from '@refinedev/core';
import React from 'react';

import { AdminListReconciliation, CustomerListReconciliation, SaleListReconciliation } from './list-reconciliations';

export const ReconciliationsList: React.FC<IResourceComponentsProps<GetListResponse<{}>>> = () => {
  const role = localStorage.getItem('role') || 'customer';
  if (role === 'customer') {
    return <CustomerListReconciliation />;
  } else if (role === 'sale') {
    return <SaleListReconciliation />;
  } else {
    return <AdminListReconciliation />;
  }
};
