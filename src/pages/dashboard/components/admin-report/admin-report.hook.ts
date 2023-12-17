import { CrudFilter, CrudFilters, HttpError, useApiUrl, useCustom, useList } from '@refinedev/core';
import { DatePickerProps, TableProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { ColumnFilterItem } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { IUser, ReportOrderByCustomer, ReportResponse } from 'interfaces/types';
import { useCallback, useEffect, useState } from 'react';
import { APIEndPoint, getDateOrders } from 'utils';

export function useAdminReport() {
  const startDate = dayjs().startOf('D');
  const endDate = dayjs();
  const apiUrl = useApiUrl();
  const [reportFilters, setReportFilters] = useState<CrudFilter[]>([
    {
      field: 'createdAt',
      operator: 'gte',
      value: startDate.toISOString(),
    },
    {
      field: 'createdAt',
      operator: 'lte',
      value: endDate.toISOString(),
    },
  ]);
  const [saleOptions, setSaleOptions] = useState<ColumnFilterItem[]>([]);
  const [customerOptions, setCustomerOptions] = useState<ColumnFilterItem[]>([]);
  const { data, isLoading, isRefetching, refetch } = useCustom<ReportResponse>({
    config: {
      filters: reportFilters,
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.REPORT}`,
  });

  const { data: userData } = useList<IUser, HttpError>({
    pagination: {
      mode: 'off',
    },
    resource: APIEndPoint.USERS,
  });

  useEffect(() => {
    if (userData) {
      const sale = userData?.data?.filter(user => user.role.type === 'sale' || user.role.type === 'admin');
      const customer = userData?.data?.filter(user => user.role.type === 'customer');

      setSaleOptions(
        sale?.map(item => {
          return {
            text: item.username,
            value: item.username,
          };
        }),
      );
      setCustomerOptions(
        customer?.map(item => {
          return {
            text: item.username,
            value: item.username,
          };
        }),
      );
    }
  }, [userData]);

  const handleOnTableChange: TableProps<ReportOrderByCustomer>['onChange'] = async (pagination, filters, sorter) => {
    const updatedFilters = [...reportFilters];
    const otherFields = updatedFilters.filter(item => {
      return item.operator === 'gte' || item.operator === 'lte';
    });

    let tableFilter: CrudFilters = [];
    for (const key in filters) {
      if (filters[key]) {
        tableFilter.push({
          field: key,
          operator: 'eq',
          value: filters[key],
        });
      }
    }

    setReportFilters([...otherFields.concat(tableFilter)]);
    await refetch();
  };

  const handleOnchangeRangePicker = useCallback(
    async (value: DatePickerProps['value'] | RangePickerProps['value'], dateString: [string, string] | string) => {
      const updatedFilters = [...reportFilters];
      const otherFields = updatedFilters.filter(item => {
        return item.operator !== 'gte' && item.operator !== 'lte';
      });
      const dates = getDateOrders([dayjs(dateString[0]), dayjs(dateString[1])]);
      setReportFilters([
        ...otherFields,
        {
          field: 'createdAt',
          operator: 'gte',
          value: dates[0].toISOString(),
        },
        {
          field: 'createdAt',
          operator: 'lte',
          value: dates[1].toISOString(),
        },
      ]);

      await refetch();
    },
    [refetch, reportFilters],
  );
  return { customerOptions, data, endDate, handleOnchangeRangePicker, handleOnTableChange, isLoading, isRefetching, saleOptions, startDate };
}
