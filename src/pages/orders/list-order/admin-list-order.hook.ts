import { useModal, useTable } from '@refinedev/antd';
import { HttpError } from '@refinedev/core';
import dayjs from 'dayjs';
import { IOrder } from 'interfaces/types';
import { useCallback, useState } from 'react';
import { APIEndPoint, exportToExcel } from 'utils';

import { IAdminSearchOrder } from '../components/admin-search-form';
import { columnsExportOrderByAdmin, generateBarCode, generateQrCode, initFilters, normalizeDataExportOrder, onAdminSearchOrder } from '../utils/orders';

export function useAdminListOrder() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [recordAWBs, setRecordAWBs] = useState<{ order: IOrder; qrcode: string; barcodeUrl: string }[]>([]);
  const { modalProps: modalAWBProps, show: showAWB } = useModal();
  const [isExportFormOpen, setIsExportFormOpen] = useState(false);

  // ======================== APIs ========================
  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { data: orderData, isLoading: isLoadingOrder, isRefetching: isRefetchingOrder, refetch: handleRefetchOrder },
  } = useTable<IOrder, HttpError, IAdminSearchOrder>({
    filters: {
      defaultBehavior: 'replace',
      initial: initFilters,
      mode: 'server',
    },
    onSearch: onAdminSearchOrder,
    pagination: {
      pageSize: 100,
    },
    resource: APIEndPoint.ORDERS,
    syncWithLocation: false,
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

  const handlePrintAWBs = async (orderAWBs: IOrder[]) => {
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
  };

  // Handle print AWB selected orders
  const handleSelectedAWBs = async () => {
    const orderFiltered = orderData?.data.filter(item => selectedRowKeys.includes(item.id));
    if (orderFiltered) {
      await handlePrintAWBs(orderFiltered);
    }
  };

  // Handle export excel
  const handleExportExcel = () => {
    const orderFiltered = orderData?.data.filter(item => selectedRowKeys.includes(item.id));
    if (orderFiltered) {
      exportToExcel(normalizeDataExportOrder(orderFiltered), columnsExportOrderByAdmin, `BSS_Danh sách đơn hàng_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  };

  // Handle open and close export form
  const handleOpenExportForm = useCallback(() => {
    setIsExportFormOpen(true);
  }, []);

  const handleCloseExportForm = useCallback(() => {
    setIsExportFormOpen(false);
  }, []);

  return {
    handleCloseExportForm,
    handleExportExcel,
    handleOpenExportForm,
    handlePrintAWBs,
    handleRefetchOrder,
    handleSelectedAWBs,
    isExportFormOpen,
    isLoadingOrder,
    isRefetchingOrder,
    modalAWBProps,
    orderData,
    recordAWBs,
    rowSelection,
    searchFormProps,
    selectedRowKeys,
    tableProps,
  };
}
