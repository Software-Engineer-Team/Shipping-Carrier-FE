import { useTable } from '@refinedev/antd';
import { HttpError, useGo, useUpdate } from '@refinedev/core';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import { IReconciliation } from '../../../../interfaces/types';
import { APIEndPoint, exportToExcel } from '../../../../utils';
import { IAdminSearchReconciliation } from '../../components/AdminSearchForm';
import { columnsExportReconciliation, normalizeExportData, onAdminSearchReconciliations } from '../../utils/reconciliations';
const MODAL_TEXT_DEFAULT = 'Bạn có muốn thực hiện tác vụ này';

export function useAdminListReconciliation() {
  const [action, setAction] = useState({ recordId: '', type: '' });
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(MODAL_TEXT_DEFAULT);
  const { mutate } = useUpdate();
  const go = useGo();

  const { searchFormProps, setFilters, tableProps, tableQueryResult } = useTable<IReconciliation, HttpError, IAdminSearchReconciliation>({
    filters: {
      defaultBehavior: 'replace',
      initial: [
        {
          field: 'status',
          operator: 'eq',
          value: 'pending',
        },
        {
          field: 'createdAt',
          operator: 'gte',
          value: dayjs().subtract(7, 'day').toISOString(),
        },
        {
          field: 'createdAt',
          operator: 'lte',
          value: dayjs().toISOString(),
        },
      ],
      mode: 'server',
    },
    onSearch: onAdminSearchReconciliations,
    pagination: {
      pageSize: 100,
    },
    resource: APIEndPoint.RECONCILIATIONS,
    syncWithLocation: false,
  });

  const onShowModal = () => {
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };

  const handleSelectAction = useCallback(
    (type: string, record: IReconciliation) => {
      setAction({ recordId: record.id.toString(), type });
      switch (type) {
        case 'confirmed':
        case 'cancelled':
          onShowModal();
          break;
        case 'show':
          go({
            to: `/reconciliations/show/${record.id}`,
            type: 'push',
          });
          break;
        default:
          break;
      }
    },
    [go],
  );

  const handleConfirm = useCallback(() => {
    let resource = '';
    let descriptionSuccess = '';
    if (action.type === 'confirmed') {
      resource = APIEndPoint.CONFIRM_RECONCILIATION;
      descriptionSuccess = 'Phiếu đã được đối soát';
    }
    if (action.type === 'cancelled') {
      resource = APIEndPoint.CANCEL_RECONCILIATION;
      descriptionSuccess = 'Phiếu đã được hủy';
    }
    mutate(
      {
        errorNotification: (error, values, resource) => {
          return {
            description: 'Lỗi',
            message: error?.message || 'Lỗi khi xác thực đối soát',
            type: 'error',
          };
        },
        id: Number(action.recordId),
        resource: resource,
        successNotification: (data, values, resource) => {
          return {
            description: descriptionSuccess,
            message: 'Thành công',
            type: 'success',
          };
        },
        values: {},
      },
      {
        onSuccess: (data, variables, context) => {
          setFilters(
            [
              {
                field: 'status',
                operator: 'eq',
                value: 'pending',
              },
            ],
            'replace',
          );
          setModalText('Thẻ này sẽ đóng sau 2s');
          setConfirmLoading(true);
          setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
          }, 2000);
          setModalText(MODAL_TEXT_DEFAULT);
          tableQueryResult.refetch();
        },
      },
    );
  }, [action.recordId, action.type, mutate, setFilters, tableQueryResult]);

  const handleExportExcel = useCallback(() => {
    if (tableQueryResult?.data?.data) {
      exportToExcel(normalizeExportData(tableQueryResult?.data?.data), columnsExportReconciliation, `BSS_Danh sách đối soát_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  }, [tableQueryResult?.data?.data]);
  return { confirmLoading, handleConfirm, handleExportExcel, handleSelectAction, modalText, onCloseModal, onShowModal, open, searchFormProps, tableProps };
}
