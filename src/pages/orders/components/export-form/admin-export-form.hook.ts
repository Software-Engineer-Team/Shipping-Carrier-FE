import { CrudFilters, useList, useSelect } from '@refinedev/core';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { IOrder, IUser } from 'interfaces/types';
import { columnsExportOrderByAdmin, normalizeDataExportOrder } from 'pages/orders/utils/orders';
import { useCallback, useEffect, useState } from 'react';
import { APIEndPoint, exportToExcel, getDateOrders } from 'utils';

export function useAdminExportForm() {
  const [form] = Form.useForm();
  const [enableExport, setEnableExport] = useState<boolean>(false);
  const [filters, setFilters] = useState<CrudFilters>([]);
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);

  const { data: orderData, isFetching } = useList<IOrder>({
    filters: filters,
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: enableExport,
    },
    resource: APIEndPoint.ORDERS,
  });

  const { queryResult: customerQueryResult } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    resource: APIEndPoint.USERS,
  });

  useEffect(() => {
    if (customerQueryResult?.data?.data) {
      setCustomerOptions(
        customerQueryResult?.data?.data?.filter(user => {
          return user?.role?.type === 'customer';
        }),
      );
    }
  }, [customerQueryResult?.data?.data]);

  useEffect(() => {
    if (orderData?.data) {
      exportToExcel(normalizeDataExportOrder(orderData?.data), columnsExportOrderByAdmin, `BSS_Danh sách đơn hàng_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  }, [orderData]);

  const onFinish = (values: any) => {
    const filters: CrudFilters = [];
    if (values.status) {
      filters.push({
        field: 'status',
        operator: 'in',
        value: values.status,
      });
    }
    if (values.is_reconciled) {
      filters.push({
        field: 'is_reconciled',
        operator: 'eq',
        value: values.is_reconciled,
      });
    }
    if (values.carrier) {
      filters.push({
        field: 'carrier.name',
        operator: 'in',
        value: values.carrier,
      });
    }
    if (values.customer) {
      filters.push({
        field: 'customer.id',
        operator: 'eq',
        value: values.customer,
      });
    }
    if (values.createdAt) {
      const [from, to] = getDateOrders(values.createdAt);
      filters.push({
        field: 'createdAt',
        operator: 'gte',
        value: from.toISOString(),
      });
      filters.push({
        field: 'createdAt',
        operator: 'lte',
        value: to.toISOString(),
      });
    }
    if (values.end_date) {
      const [from, to] = getDateOrders(values.end_date);
      filters.push({
        field: 'end_date',
        operator: 'gte',
        value: from.toISOString(),
      });
      filters.push({
        field: 'end_date',
        operator: 'lte',
        value: to.toISOString(),
      });
    }
    setFilters(filters);
    setEnableExport(true);
  };

  const handleSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  const handleResetForm = useCallback(() => {
    form.resetFields();
  }, [form]);

  return {
    customerOptions,
    form,
    handleResetForm,
    handleSubmit,
    isFetching,
    onFinish,
  };
}
