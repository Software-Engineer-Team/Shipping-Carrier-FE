import { Create, ImportButton, useForm, useImport, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useTranslate } from '@refinedev/core';
import { Form, Input, Select, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { APIEndPoint, StringUtils } from 'utils';

import { ICarrier, IPriceItem, IPriceSheet, IZonePick } from '../../interfaces/types';

export const PriceSheetsCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { goBack } = useNavigation();
  const { form, formLoading, formProps, onFinish, saveButtonProps } = useForm<IPriceSheet>({
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo bảng giá',
        type: 'error',
      };
    },
    meta: { populate: ['price_items', 'name', 'carrier'] },
    onMutationSuccess: (data, variables, context, isAutoSave) => {
      goBack();
    },
    resource: APIEndPoint.PRICE_SHEETS,
    successNotification: (data, values, resource) => {
      return {
        description: 'Thành công',
        message: 'Bảng giá được tạo thành công',
        type: 'success',
      };
    },
  });

  const importProps = useImport<IPriceItem>({
    meta: {
      disabled: true,
    },
    paparseOptions: {
      complete: function (results: any, file: any) {
        // convert string to number
        const parse: IPriceItem[] = results.data.map((item: any) => {
          const zonesPick = item?.zone_pick.split('-').map((item: string) => {
            return {
              name: item,
            };
          });
          return {
            ...item,
            carrier_account: item?.carrier_account,
            custom: item?.weight ? { weight: item?.weight } : null,
            from_weight: Number(item?.from_weight),
            purchase_price: Number(item?.purchase_price.replace(/\D/g, '')),
            return_fee: Number(item?.return_fee.replace(/\D/g, '')),
            sale_price: Number(item?.sale_price.replace(/\D/g, '')),
            step_price: Number(item?.step_price.replace(/\D/g, '')),
            to_weight: Number(item?.to_weight),
            zone_pick: zonesPick,
            zone_type: item?.zone_type,
          };
        });
        form.setFieldValue('price_items', parse);
      },
      header: true,
      transformHeader: (header: string, index: number) => {
        switch (index) {
          case 0:
            return 'from_weight';
          case 1:
            return 'to_weight';
          case 2:
            return 'purchase_price';
          case 3:
            return 'sale_price';
          case 4:
            return 'zone_type';
          case 5:
            return 'step_price';
          case 6:
            return 'return_fee';
          case 7:
            return 'carrier_account';
          case 8:
            return 'weight';
          case 9:
            return 'zone_pick';
          default:
            return header.toLowerCase().trim();
        }
      },
    },
  });

  const { selectProps: carrierSelectProps } = useSelect<ICarrier>({
    optionLabel: 'name',
    optionValue: 'id',
    resource: APIEndPoint.CARRIERS,
  });

  const columns = useMemo<(ColumnGroupType<IPriceItem> | ColumnType<IPriceItem>)[]>(() => {
    return [
      {
        dataIndex: 'from_weight',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'from_weight']} style={{ margin: 0 }}>
              {value}
            </Form.Item>
          );
        },
        title: 'Từ',
        width: '3%',
      },
      {
        dataIndex: 'to_weight',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'to_weight']} style={{ margin: 0 }}>
              {value}
            </Form.Item>
          );
        },
        title: 'Đến',
        width: '3%',
      },
      {
        dataIndex: 'purchase_price',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'purchase_price']} style={{ margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Form.Item>
          );
        },
        title: 'Giá mua',
        width: '5%',
      },
      {
        dataIndex: 'sale_price',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'sale_price']} style={{ margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Form.Item>
          );
        },
        title: 'Giá bán',
        width: '5%',
      },
      {
        dataIndex: 'zone_type',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'zone_type']} style={{ margin: 0 }}>
              {value}
            </Form.Item>
          );
        },
        title: 'Loại vùng',
        width: '10%',
      },
      {
        dataIndex: 'step_price',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'step_price']} style={{ margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Form.Item>
          );
        },
        title: 'Giá vượt',
        width: '5%',
      },
      {
        dataIndex: 'return_fee',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'return_fee']} style={{ margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Form.Item>
          );
        },
        title: 'Phí hoàn',
        width: '10%',
      },
      {
        dataIndex: ['carrier_account'],
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'carrier_account']} style={{ margin: 0 }}>
              {value}
            </Form.Item>
          );
        },
        title: 'Tài khoản',
        width: '20%',
      },
      {
        dataIndex: ['custom', 'weight'],
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'custom', 'weight']} style={{ margin: 0 }}>
              {value}
            </Form.Item>
          );
        },
        title: 'Điều chỉnh cân nặng',
        width: '20%',
      },
      {
        dataIndex: 'zone_pick',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'zone_pick']} style={{ margin: 0 }}>
              {value.map((item: IZonePick) => item.name).join(',')}
            </Form.Item>
          );
        },
        title: 'Điểm lấy hàng',
        width: '20%',
      },
    ];
  }, []);

  const handleSubmit = async (values: any) => {
    console.log(values);
    await onFinish(values);
  };

  return (
    <Create
      resource={APIEndPoint.PRICE_SHEETS}
      title={translate('priceSheets.titles.create')}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      headerProps={{
        extra: [
          <Typography.Link href="https://docs.google.com/spreadsheets/d/1f-nkv2K6mVKfsrdGEAh0b3YiL2HtLrHybShdYIV5h6k/edit?usp=sharing" target="_blank" key={'link_csv'}>
            {translate('priceSheets.titles.csvFile')}
          </Typography.Link>,
          <ImportButton {...importProps} loading key={'upload_price_sheet'} />,
        ],
      }}
    >
      <Form {...formProps} onFinish={handleSubmit} layout="vertical" autoComplete="on">
        <Form.Item
          wrapperCol={{ span: 14 }}
          label={translate('priceSheets.labels.namePriceSheet')}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Nhập tên bảng giá" />
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 14 }}
          label={translate('priceSheets.labels.carrier')}
          name={['carrier', 'id']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...carrierSelectProps} placeholder="Chọn đơn vị vận chuyển" />
        </Form.Item>

        <Form.List name={'price_items'}>
          {() => {
            return (
              <Table
                rowKey={'uid'}
                size={'small'}
                columns={columns}
                dataSource={form.getFieldValue('price_items')}
                pagination={{
                  pageSize: 100,
                }}
              ></Table>
            );
          }}
        </Form.List>
      </Form>
    </Create>
  );
};
