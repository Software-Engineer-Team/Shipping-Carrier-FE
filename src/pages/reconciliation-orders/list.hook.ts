import { useApiUrl, useCustomMutation, useList } from '@refinedev/core';
import { CrudFilters } from '@refinedev/core/dist/interfaces';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IReconciliationOrder, IUser } from '../../interfaces/types';
import { APIEndPoint, getDateOrders, StringUtils } from '../../utils';

interface ReconciliationOrdersResponse {
  reconciliation_orders: IReconciliationOrder[];
  customer: IUser;
}

interface ReconciliationOrder {
  key: number | string;
  id: number;
  tracking_id: string;
  status: string;
  weight: number;

  partner_cash_on_delivery: number;
  partner_shipment_fee: number;
  partner_return_fee: number;
  partner_insurance_fee: number;
  partner_change_fee: number;
  partner_other_fee: number;

  system_shipment_fee: number;
  system_cash_on_delivery: number;
  system_return_fee: number;
  system_insurance_fee: number;
  system_change_fee: number;
  system_other_fee: number;

  total_shipment_fee: number;
  createdAt: string;
  start_date: string;
  end_date: string;
}
export interface ReconciliationOrdersGroupByCustomer {
  children: ReconciliationOrder[];
  key: number | string;
  customer: IUser;
}

export function useReconciliationOrdersList() {
  const apiUrl = useApiUrl();
  const { mutate } = useCustomMutation();
  const [dataSource, setDataSource] = useState<ReconciliationOrdersGroupByCustomer[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filter, setFilter] = useState<CrudFilters>([
    {
      field: 'createdAt',
      operator: 'gte',
      value: dayjs().startOf('D').toISOString(),
    },
    {
      field: 'createdAt',
      operator: 'lte',
      value: dayjs().endOf('D').toISOString(),
    },
  ]);

  const {
    data: reconOrderData,
    isLoading,
    isRefetching,
    refetch,
  } = useList<ReconciliationOrdersResponse>({
    filters: filter,
    pagination: {
      pageSize: 1000,
    },
    queryOptions: {
      enabled: true,
    },
    resource: APIEndPoint.RECONCILIATION_ORDERS_GROUP_BY_CUSTOMER,
  });

  useEffect(() => {
    if (reconOrderData?.data) {
      const data = reconOrderData?.data.map(item => {
        return {
          children: item.reconciliation_orders.map(reconOrder => {
            return { ...reconOrder, key: reconOrder.id } as ReconciliationOrder;
          }),
          customer: item.customer,
          key: StringUtils.uuidv4(),
        };
      });
      setDataSource(data);
    }
  }, [reconOrderData?.data]);

  const handleSelect = useCallback((record: ReconciliationOrdersGroupByCustomer | ReconciliationOrder, selected: boolean, selectedRows: ReconciliationOrdersGroupByCustomer[]) => {
    if (selected) {
      if ('children' in record && record.children) {
        record.children.forEach(reconOrderItem => {
          handleSelect(reconOrderItem, true, selectedRows);
        });
        setSelectedRowKeys(keys => {
          return [...keys, record.key];
        });
      } else {
        if (typeof record.key === 'number') {
          setSelectedRowKeys(keys => {
            return [...keys, record.key];
          });
        }
      }
    } else {
      if ('children' in record && record.children) {
        record.children.forEach(reconOrderItem => {
          handleSelect(reconOrderItem, false, selectedRows);
        });
        setSelectedRowKeys(keys => {
          return keys.filter(key => key !== record.key);
        });
      } else {
        if (typeof record.key === 'number') {
          setSelectedRowKeys(keys => {
            return keys.filter(key => key !== record.key);
          });
        }
      }
    }
  }, []);

  const handleSelectAll = useCallback((selected: boolean, selectedRows: ReconciliationOrdersGroupByCustomer[], changeRows: ReconciliationOrdersGroupByCustomer[]) => {
    if (selected) {
      const selectedReconIds = selectedRows.map(item => item.key);
      setSelectedRowKeys(ids => {
        return [...ids, ...selectedReconIds];
      });
    } else {
      setSelectedRowKeys([]);
    }
  }, []);

  const rowSelection: TableRowSelection<ReconciliationOrdersGroupByCustomer> = {
    onSelect: handleSelect,
    onSelectAll: handleSelectAll,
    selectedRowKeys: selectedRowKeys,
  };

  const isSelectedRowValid = useMemo(() => {
    const selectedRow = selectedRowKeys.filter(key => typeof key === 'number');
    return selectedRow.length > 0;
  }, [selectedRowKeys]);

  const handleOnChangeDatePicker = useCallback(
    async (dates?: [dayjs.Dayjs, dayjs.Dayjs]) => {
      if (dates && dates.length === 2) {
        const [from, to] = getDateOrders([dates?.[0]?.startOf('D'), dates?.[1]?.endOf('D')]);
        setFilter([
          {
            field: 'createdAt',
            operator: 'gte',
            value: from?.toISOString(),
          },
          {
            field: 'createdAt',
            operator: 'lte',
            value: to?.toISOString(),
          },
        ]);
      } else {
        setFilter([]);
      }
      await refetch();
    },
    [refetch],
  );

  const handleOnCreateReconciliation = useCallback(async () => {
    const selectedRow = selectedRowKeys.filter(key => typeof key === 'number');
    if (!isSelectedRowValid) {
      return;
    }

    mutate({
      errorNotification: (error, values, resource) => {
        return {
          description: 'Lỗi',
          message: error?.message || 'Lỗi khi tạo đối soát',
          type: 'error',
        };
      },
      method: 'post',
      successNotification: (data, values, resource) => {
        setSelectedRowKeys([]);
        refetch();
        return {
          description: `Tạo đối soát thành công`,
          message: 'Thành công',
          type: 'success',
        };
      },
      url: `${apiUrl}/${APIEndPoint.RECONCILIATIONS_CREATE_MANY}`,
      values: {
        recon_orders: selectedRow.map(item => {
          return { id: item };
        }),
      },
    });
  }, [apiUrl, isSelectedRowValid, mutate, refetch, selectedRowKeys]);

  return { dataSource, handleOnChangeDatePicker, handleOnCreateReconciliation, isLoading, isRefetching, isSelectedRowValid, rowSelection };
}
