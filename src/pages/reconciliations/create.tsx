import { Create, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation } from '@refinedev/core';
import { Divider, Form, Space, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import { APIEndPoint, ExcelImportOptions, importFromExcel, StringUtils } from 'utils';

interface ReconciliationOrder {
  tracking_id: String;
  shipment_fee: String;
  cost_on_delivery: String;
  status: String;
  successful_delivery_date: String;
  created_order_date: String;
  carrier_weight: Number;
  return_fee: Number;
  insurance_fee: Number;
}
export const ReconciliationsCreate: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();
  const { formProps, onFinish, saveButtonProps } = useForm({
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo đối soát',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.UPLOAD_RECONCILIATION,
    successNotification: (data, values, resource) => {
      return {
        description: `Tạo đối soát thành công`,
        message: 'Thành công',
        type: 'success',
      };
    },
  });

  const [reconciliationItems, setReconciliationItems] = useState<ReconciliationOrder[]>();
  const [loadingImport, setLoadingImport] = useState<boolean>(false);

  const columns = useMemo<(ColumnGroupType<ReconciliationOrder> | ColumnType<ReconciliationOrder>)[]>(() => {
    return [
      {
        dataIndex: 'tracking_id',
        title: 'Mã đơn hàng',
      },
      {
        align: 'center',
        dataIndex: 'shipment_fee',
        render: (value, record, index) => {
          return StringUtils.convertNumberToCurrency(value);
        },
        title: 'Phí vận chuyển',
      },
      {
        align: 'center',
        dataIndex: 'cost_on_delivery',
        render: (value, record, index) => {
          return StringUtils.convertNumberToCurrency(value);
        },
        title: 'Thu hộ (COD)',
      },
      {
        align: 'center',
        dataIndex: 'status',
        title: 'Trạng thái đơn hàng',
      },
      {
        align: 'center',
        dataIndex: 'successful_delivery_date',
        title: 'Ngày giao hàng',
      },
      {
        align: 'center',
        dataIndex: 'created_order_date',
        title: 'Ngày tạo đơn',
      },
      {
        align: 'center',
        dataIndex: 'carrier_weight',
        title: 'Trọng lượng',
      },
      {
        align: 'center',
        dataIndex: 'return_fee',
        title: 'Phí hoàn',
      },
      {
        align: 'center',
        dataIndex: 'insurance_fee',
        title: 'Phí bảo hiểm',
      },
    ];
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImport(true);
    const options: ExcelImportOptions = {
      dataRowIndexStart: 3, // Specify the data row start index (e.g., 3 for the third row)
      dateColumns: ['successful_delivery_date', 'created_order_date'],
      headerRowIndex: 1, // Specify the header row index (e.g., 1 for the first row)
    };
    const excelData = await importFromExcel<ReconciliationOrder>(e, options);
    setLoadingImport(false);
    if (excelData) {
      setReconciliationItems(excelData);
    }
  };

  const handleSubmit = async (values: any) => {
    values['recon_orders'] = reconciliationItems;
    await onFinish(values);
  };
  return (
    <Create title="Tạo đối soát" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" labelAlign="left" labelWrap onFinish={handleSubmit}>
        <Space direction={'vertical'}>
          <input type={'file'} onChange={handleImport} />
          <Typography.Link href={'https://docs.google.com/spreadsheets/d/1Zk7Kvtk6IYQF9Toba4AQbhPPnUL-cxfj7-W6pxXsVBI/edit?usp=sharing'} target={'_blank'}>
            Template tạo đối soát
          </Typography.Link>
        </Space>
      </Form>
      <Divider></Divider>
      <Table
        dataSource={reconciliationItems}
        pagination={{
          pageSize: 100,
        }}
        size={'small'}
        key={'uid'}
        columns={columns}
        loading={loadingImport}
      ></Table>
    </Create>
  );
};
