import { ExclamationOutlined } from '@ant-design/icons';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom, useCustomMutation, useNavigation, useNotification, useTranslate } from '@refinedev/core';
import { Alert, Card, Form, Input, InputNumber, Select, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';

import { GHNIcon, GHTKIcon, NinjavanIcon } from '../../components';
import { USER_ID_KEY } from '../../constants';
import { useSocket } from '../../contexts/socket';
import { IAddress, ICarrier, IDistrictCustom, IOrder, IProvinceCustom, IWardCustom } from '../../interfaces/types';
import { normalizeData } from '../../providers/utilities';
import { APIEndPoint, ExcelImportOptions, importFromExcel, StringUtils } from '../../utils';
import { AddressResponse } from '../addresses';
interface IOrderImport {
  to_name: string;
  to_phone_number: string;
  to_address: string;
  delivery_instructions: string;
  merchant_order_number: string;
  weight: number;
  cash_on_delivery: number;
  parcel_value: number;
  product_name: string;
  payment_type_id: number;
}

export const UploadOrdersList: React.FC<IResourceComponentsProps> = () => {
  const apiUrl = useApiUrl();
  const { mutate } = useCustomMutation<IOrder[]>();
  const [loadingImport, setLoadingImport] = useState<boolean>(false);
  const { open } = useNotification();
  const translate = useTranslate();
  const { list } = useNavigation();
  const socket = useSocket();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [address, setAddress] = useState<IAddress>();
  const { form, formProps, onFinish, saveButtonProps } = useForm<IOrder>({
    action: 'create',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi gửi đơn hàng',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      list('orders');
    },
    resource: APIEndPoint.ORDERS_UPLOAD,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Đã gửi đơn hàng, đang chờ xử lý',
        type: 'success',
      };
    },
  });

  const {
    selectProps: { options: carrierOptions },
  } = useSelect<ICarrier>({
    optionLabel: 'name',
    optionValue: 'name',
    resource: APIEndPoint.CARRIERS,
  });

  const { data: addressesData } = useCustom<AddressResponse>({
    config: {
      query: {
        user_id: localStorage.getItem(USER_ID_KEY),
      },
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.ADDRESSES}`,
  });

  const {
    queryResult: provinceQueryResult,
    selectProps: { options: provinceOptions },
  } = useSelect<IProvinceCustom>({
    optionLabel: 'name',
    optionValue: 'name',
    queryOptions: {
      enabled: true,
    },
    resource: APIEndPoint.PROVINCE,
  });
  const { queryResult: districtQueryResults } = useSelect<IDistrictCustom>({
    queryOptions: {
      enabled: true,
    },
    resource: APIEndPoint.DISTRICT,
  });

  const { queryResult: wardQueryResults } = useSelect<IWardCustom>({
    queryOptions: {
      enabled: true,
    },
    resource: APIEndPoint.WARD,
  });
  useEffect(() => {
    if (socket) {
      socket.on('message-error', data => {
        setErrorMessages(prevState => {
          return [...prevState, data?.message];
        });
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
  }, [socket, open]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const options: ExcelImportOptions = {
      dataRowIndexStart: 2, // Specify the data row start index (e.g., 3 for the third row)
      dateColumns: [],
      headerRowIndex: 1, // Specify the header row index (e.g., 1 for the first row)
    };
    const excelData = await importFromExcel<IOrderImport>(e, options);

    if (excelData) {
      setLoadingImport(true);
      mutate(
        {
          method: 'post',
          url: `${apiUrl}/${APIEndPoint.ORDERS_PARSE}`,
          values: {
            order_items: excelData,
          },
        },
        {
          onError: error => {
            setLoadingImport(false);
          },
          onSuccess: response => {
            setLoadingImport(false);
            if (response?.data) {
              form.setFieldValue('order_items', normalizeData(response.data));
            }
          },
        },
      );
    }
  };

  const onChangeAddress = (value: number) => {
    const item = addressesData?.data?.data?.find(e => e.id === value);
    setAddress(item);
  };

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

  const columns = useMemo<(ColumnGroupType<IOrder> | ColumnType<IOrder>)[]>(() => {
    return [
      {
        align: 'center',
        dataIndex: 'to_name',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'to_name']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng nhập tên người nhận',
                  required: true,
                },
              ]}
            >
              <Input bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.toName'),
        width: '10%',
      },
      {
        align: 'center',
        dataIndex: 'to_phone_number',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'to_phone_number']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng nhập đúng số điện thoại',
                  pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                  required: true,
                },
              ]}
            >
              <Input bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: 'Số điện thoại',
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'to_address',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'to_address']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: translate('form.error.notSelect', 'Vui lòng nhập địa chỉ'),
                  required: true,
                },
              ]}
            >
              <Input.TextArea bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.toAddress'),
        width: '15%',
      },
      {
        align: 'center',
        dataIndex: 'to_province',
        render: (value, record, index) => {
          const onChangeProvinceRecord = (ProvinceName: string, index: number) => {
            if (provinceQueryResult?.data?.data) {
              const data = provinceQueryResult?.data?.data.find((item: IProvinceCustom) => item.name === ProvinceName);
              if (data) {
                const orderItems = form.getFieldValue('order_items');
                orderItems[index].to_province_code = data.province_id.toString();
                orderItems[index].to_district_code = undefined;
                orderItems[index].to_district = undefined;
                orderItems[index].to_ward_code = undefined;
                orderItems[index].to_ward = undefined;
                form.setFieldValue('order_items', orderItems);
              }
            }
          };
          return (
            <>
              <Form.Item
                name={[index, 'to_province']}
                style={{ margin: 0 }}
                rules={[
                  {
                    message: 'Vui lòng chọn Tỉnh/Thành phố',
                    required: true,
                  },
                ]}
              >
                <Select
                  bordered={false}
                  options={provinceOptions}
                  filterOption={(input, option) =>
                    StringUtils.removeAccents(option?.label?.toString()?.toLowerCase() ?? '')
                      .trim()
                      .toLowerCase()
                      .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                  }
                  showSearch
                  placeholder={translate('form.label.province')}
                  onSelect={value => {
                    onChangeProvinceRecord(value, index);
                  }}
                ></Select>
              </Form.Item>
              <Form.Item
                name={'to_province_code'}
                hidden
                shouldUpdate={(prevValues: any, curValues: any) => {
                  return prevValues['to_province'] !== curValues['to_province'];
                }}
              ></Form.Item>
            </>
          );
        },
        title: translate('orders.labels.toProvince'),
        width: '10%',
      },
      {
        align: 'center',
        dataIndex: 'to_district',
        render: (value, record, index) => {
          const districtList = districtQueryResults?.data?.data.filter((item: IDistrictCustom) => item.province.province_id === record.to_province_code);
          const districtOptions = districtList?.map((item: IDistrictCustom) => ({
            label: item.name,
            value: item.name,
          }));

          const onChangeDistrictRecord = (DistrictName: string, index: number) => {
            if (districtList) {
              const data = districtList.find((item: IDistrictCustom) => item.name === DistrictName);
              if (data) {
                const orderItems = form.getFieldValue('order_items');
                orderItems[index].to_district_code = data.district_id.toString();
                orderItems[index].to_ward_code = undefined;
                orderItems[index].to_ward = undefined;
                form.setFieldValue('order_items', orderItems);
              }
            }
          };
          return (
            <>
              <Form.Item
                name={[index, 'to_district']}
                style={{ margin: 0 }}
                rules={[
                  {
                    message: 'Vui lòng chọn Quận/Huyện',
                    required: true,
                  },
                ]}
              >
                <Select
                  bordered={false}
                  showSearch={true}
                  options={districtOptions}
                  filterOption={(input, option) =>
                    StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                      .trim()
                      .toLowerCase()
                      .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                  }
                  onChange={value => {
                    onChangeDistrictRecord(value, index);
                  }}
                />
              </Form.Item>
              <Form.Item
                name={'to_district_code'}
                hidden
                shouldUpdate={(prevValues: any, curValues: any) => {
                  return prevValues['to_district'] !== curValues['to_district'];
                }}
              ></Form.Item>
            </>
          );
        },
        title: translate('orders.labels.toDistrict'),
        width: '10%',
      },
      {
        align: 'center',
        dataIndex: 'to_ward',
        render: (value, record, index) => {
          const wardList = wardQueryResults?.data?.data.filter((item: IWardCustom) => item.district.district_id === record.to_district_code);
          const wardOptions = wardList?.map((item: IWardCustom) => ({
            label: item.name,
            value: item.name,
          }));

          const onChangeWardRecord = (WardName: string, index: number) => {
            if (wardList) {
              const data = wardList.find((item: IWardCustom) => item.name === WardName);
              if (data) {
                const orderItems = form.getFieldValue('order_items');
                orderItems[index].to_ward_code = data.ward_id.toString();
                form.setFieldValue('order_items', orderItems);
              }
            }
          };
          return (
            <>
              <Form.Item
                name={[index, 'to_ward']}
                style={{ margin: 0 }}
                rules={[
                  {
                    message: 'Vui lòng chọn Phường/Xã',
                    required: true,
                  },
                ]}
              >
                <Select
                  bordered={false}
                  showSearch={true}
                  filterOption={(input, option) =>
                    StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                      .trim()
                      .toLowerCase()
                      .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                  }
                  options={wardOptions}
                  onChange={value => {
                    onChangeWardRecord(value, index);
                  }}
                />
              </Form.Item>
              <Form.Item
                name={'to_ward_code'}
                hidden
                shouldUpdate={(prevValues: any, curValues: any) => {
                  return prevValues['to_ward'] !== curValues['to_ward'];
                }}
              ></Form.Item>
            </>
          );
        },
        title: translate('orders.labels.toWard'),
        width: '10%',
      },
      {
        align: 'center',
        dataIndex: 'weight',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'weight']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng nhập cân nặng',
                  required: true,
                },
              ]}
            >
              <InputNumber bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.totalWeight'),
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'parcel_value',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'parcel_value']} style={{ margin: 0 }}>
              <InputNumber bordered={false} value={value} min={0} max={20000000} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.parcelValue'),
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'merchant_order_number',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'merchant_order_number']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng nhập đúng định dạng',
                  pattern: /^([a-zA-Z0-9]+[-])*[a-zA-Z0-9]+$/,
                },
              ]}
            >
              <Input bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.merchantOrderNumber'),
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'cash_on_delivery',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'cash_on_delivery']} style={{ margin: 0 }}>
              <InputNumber bordered={false} value={Number(value)} min={0} max={20000000} />
            </Form.Item>
          );
        },
        title: 'Tiền thu hộ',
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'has_insurance',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'has_insurance']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng chọn có bảo hiểm hay không',
                  required: true,
                },
              ]}
            >
              <Select
                bordered={false}
                value={value ? value.toString() : undefined}
                options={[
                  {
                    label: 'Có',
                    value: '1',
                  },
                  {
                    label: 'Không',
                    value: '0',
                  },
                ]}
              />
            </Form.Item>
          );
        },
        title: translate('orders.labels.hasInsuranceFee'),
        width: '5%',
      },
      {
        dataIndex: 'payment_type_id',
        render: (value, record, index) => {
          return (
            <Form.Item
              name={[index, 'payment_type_id']}
              style={{ margin: 0 }}
              rules={[
                {
                  message: 'Vui lòng chọn hình thức thanh toán',
                  required: true,
                },
              ]}
            >
              <Select
                bordered={false}
                value={value ? value.toString() : '1'}
                options={[
                  {
                    label: 'Shop trả ship',
                    value: '1',
                  },
                  {
                    label: 'Khách trả ship',
                    value: '2',
                  },
                ]}
              />
            </Form.Item>
          );
        },
        title: translate('orders.labels.paymentType'),
        width: '5%',
      },
      {
        align: 'center',
        dataIndex: 'delivery_instructions',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'delivery_instructions']} style={{ margin: 0 }}>
              <Input.TextArea bordered={false} value={value} />
            </Form.Item>
          );
        },
        title: translate('orders.labels.deliveryInstructions'),
      },
    ];
  }, [provinceOptions, districtQueryResults, wardQueryResults]);

  const handleSubmit = async (values: any) => {
    values['customer'] = localStorage?.getItem(USER_ID_KEY);
    const orderItems = values['order_items'];
    values['order_items'] = orderItems.map((item: IOrder) => {
      return {
        ...item,
        cash_on_delivery: Number(item?.cash_on_delivery),
        from_address: address?.from_address,
        from_district: address?.from_district,
        from_district_code: Number(address?.from_district_code),
        from_name: address?.from_name,
        from_phone_number: address?.from_phone_number,
        from_province: address?.from_province,
        from_province_code: Number(address?.from_province_code),
        from_ward: address?.from_ward,
        from_ward_code: Number(address?.from_ward_code),
        has_insurance: Number(item?.has_insurance) ?? 0,
        parcel_value: Number(item?.parcel_value),
        payment_type_id: Number(item?.payment_type_id) ?? 1,
        to_address: item?.to_address,
        to_district: item?.to_district,
        to_district_code: Number(item?.to_district_code),
        to_name: item?.to_name,
        to_phone_number: item?.to_phone_number,
        to_province: item?.to_province,
        to_province_code: Number(item?.to_province_code),
        to_ward: item?.to_ward,
        to_ward_code: Number(item?.to_ward_code),
        weight: Number(item?.weight),
      };
    });
    values['addresses'] = undefined;
    await onFinish(values);
  };

  return (
    <Create title={'Upload đơn bằng excel'} headerButtons={[]} saveButtonProps={saveButtonProps}>
      {errorMessages && errorMessages.length > 0 && <Alert message="Lỗi tạo đơn hàng" description={errorMessages.join('\n ')} type="error" closable />}
      <Card
        loading={loadingImport}
        extra={
          <Space direction={'horizontal'}>
            <Tooltip title={'Tải về và chỉnh sửa'}>
              <Typography.Link href="https://docs.google.com/spreadsheets/d/1ppM12Me9DvvICapHfb6dgsQAfXiQBpX6/edit?usp=sharing&ouid=102075037098804802116&rtpof=true&sd=true" target="_blank">
                Mẫu file excel up đơn
              </Typography.Link>
            </Tooltip>
            <Input type={'file'} onChange={handleImport} placeholder={'Chọn file'}></Input>
          </Space>
        }
      >
        <Form {...formProps} onFinish={handleSubmit} layout="vertical" autoComplete="on">
          <Form.Item
            name={'carrier'}
            label={'Vận chuyển'}
            rules={[
              {
                message: 'Vui lòng chọn vận chuyển',
                required: true,
              },
            ]}
          >
            <Select placeholder="Chọn đơn vị vận chuyển">
              {carrierOptions?.map((item, index) => {
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
          <Form.List name={'order_items'}>
            {() => {
              return <Table bordered={true} dataSource={form.getFieldValue('order_items')} size={'small'} pagination={false} rowKey="uid" columns={columns} scroll={{ x: 2000 }} />;
            }}
          </Form.List>
        </Form>
      </Card>
    </Create>
  );
};
