import { CrudFilters } from '@refinedev/core/dist/interfaces';

import { ISearchBank } from '../components/SearchForm';

export const onBankSearch = (params: ISearchBank): CrudFilters | Promise<CrudFilters> => {
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
