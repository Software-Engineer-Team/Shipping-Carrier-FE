import { useTranslate } from '@refinedev/core';
import { Divider, Form, FormProps, Modal, ModalProps, Select, Space, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';

import { ExcelImportOptions, importFromExcel, StringUtils } from '../../../../utils';

interface ParseOrderProps {
  onFinish: (values: any) => void;
  close: () => void;
  modalProps: ModalProps;
  formProps: FormProps;
}

interface IOrderImport {
  to_name: string;
  to_phone_number: string;
  address: string;
  delivery_instructions: string;
  merchant_order_number: string;
  weight: number;
  cash_on_delivery: number;
  parcel_value: number;
  product_name: string;
  payment_type_id: number;
}

export const ParseOrder: React.FC<ParseOrderProps> = props => {
  const { close, formProps, modalProps, onFinish } = props;
  const translate = useTranslate();

  const [orderItems, setOrderItems] = useState<IOrderImport[]>([]);
  const [loadingImport, setLoadingImport] = useState<boolean>(false);

  const cleanData = () => {
    setOrderItems([]);
    const { form } = formProps;
    if (form) form.resetFields();
  };

  const onCancel = () => {
    cleanData();
    close();
  };

  const columns = useMemo<(ColumnGroupType<IOrderImport> | ColumnType<IOrderImport>)[]>(() => {
    return [
      { dataIndex: 'to_name', title: translate('orders.labels.toName') },
      {
        dataIndex: 'to_phone_number',
        title: translate('orders.labels.toPhoneNumber'),
      },
      {
        dataIndex: 'address',
        title: translate('orders.labels.toAddress'),
      },
      {
        dataIndex: 'product_name',
        title: translate('orders.labels.productName'),
      },
      {
        align: 'center',
        dataIndex: 'weight',
        title: translate('orders.labels.totalWeight'),
      },
      {
        dataIndex: 'parcel_value',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('orders.labels.parcelValue'),
      },
      {
        dataIndex: 'cash_on_delivery',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('orders.labels.cod'),
      },
      {
        align: 'center',
        dataIndex: 'has_insurance',
        render: value => <Typography.Text>{value ? 'Có' : 'Không'}</Typography.Text>,
        title: translate('orders.labels.hasInsuranceFee'),
      },
      {
        dataIndex: 'payment_type_id',
        render: value => <Typography.Text>{value === 1 ? 'Shop trả ship' : 'Khách trả ship'}</Typography.Text>,
        title: translate('orders.labels.paymentType'),
      },
      {
        dataIndex: 'delivery_instructions',
        title: translate('orders.labels.deliveryInstructions'),
      },
    ];
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingImport(true);
    const options: ExcelImportOptions = {
      dataRowIndexStart: 2, // Specify the data row start index (e.g., 3 for the third row)
      dateColumns: [],
      headerRowIndex: 1, // Specify the header row index (e.g., 1 for the first row)
    };
    const excelData = await importFromExcel<IOrderImport>(e, options);
    setLoadingImport(false);
    if (excelData) {
      setOrderItems(excelData);
    }
  };

  const handleSubmit = async (values: any) => {
    values['order_items'] = orderItems;
    console.log(values);
    await onFinish(values);
    cleanData();
  };

  return (
    <Modal {...modalProps} title={'Upload excel đơn hàng'} okText={'Tạo'} onCancel={onCancel} width={'80%'}>
      <Form {...formProps} onFinish={handleSubmit}>
        <Space direction={'horizontal'}>
          <input type={'file'} onChange={handleImport} />
          <Typography.Link href="https://docs.google.com/spreadsheets/d/1dZ4qI0Te_DauR6Kx5b6NEfK4RzT-AqQKUTL-E7dg01c/edit?usp=sharing" target="_blank">
            File csv mẫu
          </Typography.Link>
        </Space>
      </Form>
      <Divider />
      <Table dataSource={orderItems} size={'small'} pagination={false} scroll={{ x: 2000, y: 500 }} key={'uid'} columns={columns} />
    </Modal>
  );
};
