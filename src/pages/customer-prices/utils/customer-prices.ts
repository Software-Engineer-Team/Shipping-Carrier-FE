import { CrudFilters } from '@refinedev/core/dist/interfaces';

import { ISearchCustomerPrice } from '../components/SearchForm';

export const onCustomerPricesSearch = (params: ISearchCustomerPrice): CrudFilters | Promise<CrudFilters> => {
  const filters: CrudFilters = [];
  const { customer } = params;
  if (customer) {
    filters.push({
      field: 'user.id',
      operator: 'eq',
      value: customer,
    });
  }
  return filters;
};
