import { CrudOperators } from '@refinedev/core';

export const mapOperator = (operator: CrudOperators) => {
  switch (operator) {
    case 'startswith':
      return 'startsWith';
    case 'endswith':
      return 'endsWith';
    case 'nin':
      return 'notIn';
    case 'ncontains':
      return 'notContains';
    case 'ncontainss':
      return 'notContainsi';
    case 'containss':
      return 'containsi';
    case 'contains':
      return 'contains';
    case 'nnull':
      return 'notNull';
  }

  return operator;
};
