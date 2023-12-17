import { ExclamationOutlined } from '@ant-design/icons';
import { ImportButton, useImport, useSelect } from '@refinedev/antd';
import { useApiUrl, useCustom, useGetIdentity, useNotification, useTranslate } from '@refinedev/core';
import { Divider, Form, FormProps, Modal, ModalProps, Select, Space, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';

import { USER_ID_KEY } from '../../../constants';
import { useSocket } from '../../../contexts/socket';
import { IAddress, ICarrier, IOrder, IUser } from '../../../interfaces/types';
import { AddressResponse } from '../../../pages/addresses';
import { APIEndPoint, StringUtils, transformHeaderOrder } from '../../../utils';
import { GHNIcon, GHTKIcon, NinjavanIcon } from '../../logo-icons';

interface UploadOrderProps {
  onFinish: (values: any) => void;
  close: () => void;
  modalProps: ModalProps;
  formProps: FormProps;
}
export const UploadOrder: React.FC<UploadOrderProps> = props => {
  const { close, formProps, modalProps, onFinish } = props;
  const { data: userData } = useGetIdentity<IUser>();
  const apiUrl = useApiUrl();
  const translate = useTranslate();
  const { open } = useNotification();
  const socket = useSocket();

  const [orderItems, setOrderItems] = useState<IOrder[]>([]);
  const [address, setAddress] = useState<IAddress>();
  const { data: addressesData } = useCustom<AddressResponse>({
    config: {
      query: {
        user_id: localStorage.getItem(USER_ID_KEY),
      },
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.ADDRESSES}`,
  });

  const importProps = useImport<IOrder>({
    meta: {
      disabled: true,
    },
    paparseOptions: {
      complete: function (results: any, file: any) {
        const parse: IOrder[] = results.data.map((item: any) => {
          return {
            ...item,
            cash_on_delivery: Number(item.cash_on_delivery.replace(/\D/g, '')),
            has_insurance: Number(item.has_insurance.replace(/\D/g, '')),
            parcel_value: Number(item.parcel_value.replace(/\D/g, '')),
            weight: Number(item.weight.replace(/\D/g, '')),
          };
        });
        setOrderItems(parse);
      },
      header: true,
      transformHeader: transformHeaderOrder,
    },
  });
  const getIconCarrier = (type: string | number) => {
    switch (type) {
      case 'GHN':
        return <GHNIcon />;
      case 'GHTK':
        return <GHTKIcon />;
      case 'NINJAVAN':
        return <NinjavanIcon />;
      default:
        return <ExclamationOutlined />;
    }
  };

  const {
    selectProps: { options },
  } = useSelect<ICarrier>({
    optionLabel: 'name',
    optionValue: 'name',
    resource: APIEndPoint.CARRIERS,
  });

  useEffect(() => {
    if (socket) {
      socket.on('message-error', data => {
        open?.({
          description: data?.message,
          message: data?.name,
          type: 'error',
        });
      });
      socket.on('message-success', data => {
        open?.({
          description: data?.tracking_id,
          message: 'Tạo đơn hàng thành công',
          type: 'success',
        });
      });
    }
    return () => {
      socket?.off('message-success');
      socket?.off('message-error');
    };
  }, [socket]);

  const onFinishHandler = async (values: any) => {
    values['customer'] = userData?.id;
    values['order_items'] = orderItems.map(item => {
      return {
        ...item,
        from_address: address?.from_address,
        from_district: address?.from_district,
        from_district_code: address?.from_district_code,
        from_name: address?.from_name,
        from_phone_number: address?.from_phone_number,
        from_province: address?.from_province,
        from_province_code: address?.from_province_code,
        from_ward: address?.from_ward,
        from_ward_code: address?.from_ward_code,
      };
    });
    values['addresses'] = undefined;
    onFinish(values);
    cleanData();
    close();
  };

  const onChangeAddress = (value: number) => {
    const item = addressesData?.data?.data?.find(e => e.id === value);
    setAddress(item);
  };

  const cleanData = () => {
    setOrderItems([]);
    const { form } = formProps;
    if (form) form.resetFields();
  };

  const onCancel = () => {
    cleanData();
    close();
  };

  const columns = useMemo<(ColumnGroupType<IOrder> | ColumnType<IOrder>)[]>(() => {
    return [
      { dataIndex: 'to_name', title: translate('orders.labels.toName') },
      {
        dataIndex: 'to_phone_number',
        title: translate('orders.labels.toPhoneNumber'),
      },
      {
        dataIndex: 'to_province',
        title: translate('orders.labels.toProvince'),
      },
      {
        dataIndex: 'to_district',
        title: translate('orders.labels.toDistrict'),
      },
      {
        dataIndex: 'to_ward',
        title: translate('orders.labels.toWard'),
      },
      {
        dataIndex: 'to_address',
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

  return (
    <Modal {...modalProps} title={'Upload excel đơn hàng'} okText={'Tạo'} onCancel={onCancel} width={'80%'}>
      <Form {...formProps} onFinish={onFinishHandler}>
        <Form.Item
          name={'carrier'}
          label={'Chọn đơn vị vận chuyển '}
          rules={[
            {
              message: 'Vui lòng chọn đơn vị vận chuyển',
              required: true,
            },
          ]}
        >
          <Select placeholder="Chọn đơn vị vận chuyển">
            {options?.map((item, index) => {
              return (
                <Select.Option value={item.value} key={index}>
                  <Space.Compact direction={'horizontal'} size={'small'}>
                    {getIconCarrier(item.value || '')}
                    <Typography style={{ marginLeft: 5 }}>{item.label}</Typography>
                  </Space.Compact>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name={'addresses'}
          label={'Chọn kho hàng'}
          rules={[
            {
              message: 'Vui lòng chọn kho hàng',
              required: true,
            },
          ]}
        >
          <Select placeholder="Chọn kho hàng" onChange={onChangeAddress}>
            {addressesData?.data?.data?.map((address, index) => {
              return (
                <Select.Option value={address.id} key={index}>
                  {[address.from_name, address.from_phone_number, address.from_address, address.from_ward, address.from_district, address.from_province].join(', ')}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Space direction={'horizontal'}>
          <ImportButton {...importProps} loading={false} />
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
