import { useTable, useModal } from '@refinedev/antd';
import { HttpError } from '@refinedev/core';
import dayjs from 'dayjs';
import { IOrder } from 'interfaces/types';
import { useCallback, useState } from 'react';
import { APIEndPoint, columnsExportOrderByCustomer, exportToExcel } from 'utils';

import { ISearchCustomerOrder } from '../components/customer-search-form';
import { generateBarCode, generateQrCode, initFilters, onCustomerSearchOrder } from '../utils/orders';

export function useCustomerListOrder() {
  const { modalProps: modalAWBProps, show: showAWB } = useModal();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [recordAWBs, setRecordAWBs] = useState<{ order: IOrder; qrcode: string; barcodeUrl: string }[]>([]);

  // ======================== APIs ========================
  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { data: dataOrder, isLoading: isLoadingOrder, isRefetching: isRefetchingOrder, refetch: refetchOrder },
  } = useTable<IOrder, HttpError, ISearchCustomerOrder>({
    filters: {
      defaultBehavior: 'replace',
      initial: initFilters,
      mode: 'server',
    },
    onSearch: onCustomerSearchOrder,
    pagination: {
      pageSize: 100,
    },
    resource: APIEndPoint.ORDERS,
    syncWithLocation: true,
  });

  // ======================== Extra actions ========================
  // Handle on select multiple row
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const handlePrintAWBs = useCallback(
    async (orderAWBs: IOrder[]) => {
      Promise.all(
        orderAWBs?.map(async order => {
          const url = await generateQrCode(order);
          const barcodeUrl = await generateBarCode(order);
          return { barcodeUrl: barcodeUrl || '', order, qrcode: url };
        }),
      ).then(ordersWithQr => {
        setRecordAWBs(ordersWithQr);
        showAWB();
      });
    },
    [showAWB],
  );

  // Handle print AWB selected orders
  const handleSelectedAWBs = useCallback(async () => {
    const orderFiltered = dataOrder?.data.filter(item => selectedRowKeys.includes(item.id));
    if (orderFiltered) {
      await handlePrintAWBs(orderFiltered);
    }
  }, [dataOrder?.data, handlePrintAWBs, selectedRowKeys]);

  // Handle export excel
  const handleExportExcel = useCallback(() => {
    const orderFiltered = dataOrder?.data.filter(item => selectedRowKeys.includes(item.id));
    if (orderFiltered) {
      exportToExcel(orderFiltered, columnsExportOrderByCustomer, `BSS_Danh sách đơn hàng_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  }, [dataOrder?.data, selectedRowKeys]);

  return { dataOrder, handleExportExcel, handlePrintAWBs, handleSelectedAWBs, isLoadingOrder, isRefetchingOrder, modalAWBProps, recordAWBs, refetchOrder, rowSelection, searchFormProps, tableProps };
}
