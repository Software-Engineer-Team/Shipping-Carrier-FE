import { Edit, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useParsed, useTranslate } from '@refinedev/core';
import { Checkbox, Form, Input, InputNumber, Select, Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { APIEndPoint, zoneOptions, zonePickOptions } from 'utils';

import { ICarrier, ICarrierAccount, IPriceItem, IPriceSheet } from '../../interfaces/types';

export const PriceSheetsEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { id } = useParsed();
  const { goBack } = useNavigation();
  const { form, formLoading, formProps, onFinish, saveButtonProps } = useForm<IPriceSheet>({
    action: 'edit',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi cập nhật bảng giá',
        type: 'error',
      };
    },
    id,

    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.PRICE_SHEETS,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Bảng giá được cập nhật thành công',
        type: 'success',
      };
    },
  });

  const { selectProps: carrierSelectProps } = useSelect<ICarrier>({
    optionLabel: 'name',
    optionValue: 'id',
    resource: APIEndPoint.CARRIERS,
  });
  const { selectProps: carrierAccountSelectProps } = useSelect<ICarrierAccount>({
    optionLabel: 'account_name',
    optionValue: 'id',
    resource: APIEndPoint.CARRIER_ACCOUNT,
  });

  const onChangeCheckBoxGroup = (value: any, index: any) => {
    const price_items = form.getFieldValue(`price_items`);
    const zone_pick = price_items[index].zone_pick;
    const new_zone_pick = value.map((v: any) => {
      const zP = zone_pick.find((zP: any) => zP.name === v);
      if (!zP) {
        return { name: v };
      }
      return zP;
    });
    price_items[index].zone_pick = new_zone_pick;
    form.setFieldValue(`price_items`, price_items);
  };

  const columns = useMemo<(ColumnGroupType<IPriceItem> | ColumnType<IPriceItem>)[]>(() => {
    return [
      {
        dataIndex: 'from_weight',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'from_weight']} style={{ margin: 0 }}>
              <InputNumber bordered={false} value={value} />
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
              <InputNumber bordered={false} value={value} />
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
              <InputNumber bordered={false} />
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
              <InputNumber bordered={false} />
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
              <Select options={zoneOptions} bordered={false} />
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
              <InputNumber bordered={false} />
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
              <InputNumber bordered={false} />
            </Form.Item>
          );
        },
        title: 'Phí hoàn',
        width: '10%',
      },
      {
        dataIndex: 'carrier_account.id',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'carrier_account', 'id']} style={{ margin: 0 }}>
              <Select
                {...carrierAccountSelectProps}
                bordered={false}
                onSelect={(value, option) => {
                  const price_items = form.getFieldValue(`price_items`);
                  price_items[index].carrier_account = {
                    account_name: option.label,
                    id: option.value,
                  };
                  form.setFieldValue(`price_items`, price_items);
                }}
              />
            </Form.Item>
          );
        },
        title: 'Tài khoản',
        width: '20%',
      },
      {
        dataIndex: 'custom.weight',
        render: (value, record, index) => {
          return (
            <Form.Item name={[index, 'custom', 'weight']} style={{ margin: 0 }}>
              <InputNumber bordered={false} />
            </Form.Item>
          );
        },
        title: 'Điều chỉnh cân nặng',
        width: '5%',
      },
      {
        dataIndex: 'zone_pick',
        render: (value, record, index) => {
          return (
            <Checkbox.Group
              style={{ flexWrap: 'nowrap' }}
              options={zonePickOptions}
              defaultValue={value.map((v: any) => v.name)}
              onChange={value => {
                onChangeCheckBoxGroup(value, index);
              }}
            />
          );
        },
        title: 'Điểm lấy hàng',
        width: '35%',
      },
    ];
  }, [carrierAccountSelectProps]);

  const handleSubmit = async (values: any) => {
    console.log('values', values);
    await onFinish(values);
  };

  return (
    <Edit title={translate('priceSheets.titles.edit')} resource={APIEndPoint.PRICE_SHEETS} saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} onFinish={handleSubmit} layout="horizontal" autoComplete="on">
        <Form.Item
          label={translate('priceSheets.labels.namePriceSheet')}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translate('priceSheets.labels.carrier')}
          name={['carrier', 'id']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...carrierSelectProps} />
        </Form.Item>
        <Form.List name={'price_items'}>
          {() => {
            return (
              <Table
                rowKey={'id'}
                size={'small'}
                columns={columns}
                dataSource={form.getFieldValue('price_items')}
                pagination={{
                  pageSize: 100,
                }}
                scroll={{ x: true }}
              />
            );
          }}
        </Form.List>
      </Form>
    </Edit>
  );
};
