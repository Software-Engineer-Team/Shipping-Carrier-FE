import { useForm } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import React, { useCallback, useState } from 'react';

import { APIEndPoint, ExcelImportOptions, importFromExcel } from '../../utils';
export interface ReconciliationOrder {
  tracking_id: String;
  shipment_fee: String;
  cost_on_delivery: String;
  status: String;
  successful_delivery_date: String;
  created_order_date: String;
  carrier_weight: Number;
  return_fee: Number;
  insurance_fee: Number;
  change_fee: Number;
  other_fee: Number;
}
export function useReconciliationOrdersCreate() {
  const [reconciliationItems, setReconciliationItems] = useState<ReconciliationOrder[]>();
  const [loadingImport, setLoadingImport] = useState<boolean>(false);
  const [error, setError] = useState<{
    title: string;
    subtitle: string;
    trackingIds: string[];
  }>();
  const { goBack } = useNavigation();
  const { formProps, onFinish, saveButtonProps } = useForm({
    errorNotification: (error, values) => {
      const trackingIds = error?.errors?.trackingIds as [string];
      if (trackingIds) {
        setError({
          subtitle: `Tổng ${trackingIds.length} / ${reconciliationItems?.length} đơn hàng bị lỗi`,
          title: error?.message || 'Lỗi khi tạo đối soát',
          trackingIds,
        });
      }
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo đối soát',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.RECONCILIATION_ORDERS_UPLOAD,
    successNotification: (data, values, resource) => {
      return {
        description: `Tạo đối soát thành công`,
        message: 'Thành công',
        type: 'success',
      };
    },
  });
  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImport(true);
    const options: ExcelImportOptions = {
      dataRowIndexStart: 2, // Specify the data row start index (e.g., 3 for the third row)
      dateColumns: ['successful_delivery_date', 'created_order_date'],
      headerRowIndex: 1, // Specify the header row index (e.g., 1 for the first row)
    };
    const excelData = await importFromExcel<ReconciliationOrder>(e, options);
    setLoadingImport(false);
    if (excelData) {
      // convert string to number
      const parse: ReconciliationOrder[] = excelData.map((item: any) => {
        return {
          ...item,
          carrier_weight: Number(item?.carrier_weight),
          change_fee: Number(item?.change_fee),
          cost_on_delivery: Number(item?.cost_on_delivery),
          insurance_fee: Number(item?.insurance_fee),
          other_fee: Number(item?.other_fee),
          return_fee: Number(item?.return_fee),
          shipment_fee: Number(item?.shipment_fee),
        };
      });
      setReconciliationItems(parse);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: any) => {
      values['orders'] = reconciliationItems;
      await onFinish(values);
    },
    [onFinish, reconciliationItems],
  );

  return {
    error,
    formProps,
    handleImport,
    handleSubmit,
    loadingImport,
    reconciliationItems,
    saveButtonProps,
  };
}
