import { CrudFilters } from '@refinedev/core/dist/interfaces';

import { ISearchCustomer } from '../components/SearchForm';

export const onCustomerSearch = (params: ISearchCustomer): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { customer, email_or_phone_number, sale } = params;
  if (customer) {
    filters.push({
      field: 'id',
      operator: 'eq',
      value: customer,
    });
  }
  if (sale) {
    filters.push({
      field: 'sale.id',
      operator: 'eq',
      value: sale,
    });
  }
  if (email_or_phone_number) {
    filters.push({
      operator: 'or',
      value: [
        {
          field: 'email',
          operator: 'contains',
          value: email_or_phone_number,
        },
        {
          field: 'phone_number',
          operator: 'contains',
          value: email_or_phone_number,
        },
      ],
    });
  }
  filters.push({
    field: 'role.type',
    operator: 'eq',
    value: 'customer',
  });
  return filters;
};
