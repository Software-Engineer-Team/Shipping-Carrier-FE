import { Create, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useTranslate } from '@refinedev/core';
import { Form, Select, Spin, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { ICarrierPrice, IPriceItem, IPriceSheet, IUser } from 'interfaces/types';
import React, { useEffect, useMemo, useState } from 'react';
import { APIEndPoint, StringUtils } from 'utils';

export const CustomerPricesCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const [priceSheetData, setPriceSheetData] = useState<IPriceItem[]>([]);
  const [carrierName, setCarrierName] = useState<string>('');
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);

  const { goBack } = useNavigation();
  const { form, formLoading, formProps, saveButtonProps } = useForm<ICarrierPrice>({
    errorNotification: error => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo giá khách hàng',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.USER_PRICE_SHEETS,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Giá khách hàng được tạo thành công',
        type: 'success',
      };
    },
  });

  const {
    queryResult: { data: customerList, isLoading: isLoadingUsers },
  } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'in',
        value: ['customer'],
      },
    ],
    resource: APIEndPoint.USERS,
  });

  const {
    queryResult: { data: priceSheetList, isLoading: isLoadingPriceSheets },
    selectProps: priceSheetSelectProps,
  } = useSelect<IPriceSheet>({
    meta: {
      populate: ['price_items', 'carrier'],
    },
    optionLabel: 'name',
    optionValue: 'id',
    resource: APIEndPoint.PRICE_SHEETS,
  });

  useEffect(() => {
    if (customerList?.data) {
      setCustomerOptions(
        customerList?.data?.filter(user => {
          return user?.role?.type === 'customer';
        }),
      );
    }
  }, [customerList?.data]);

  useEffect(() => {
    if (priceSheetList) {
      const priceSheet = priceSheetList.data.find(item => item.id === Number(form.getFieldValue('price_sheet_id')));
      setCarrierName(priceSheet?.carrier.name || '');
      setPriceSheetData(priceSheet?.price_items || []);
    }
  }, [form, priceSheetList]);

  // Define columns to show for customer
  const columns = useMemo<(ColumnGroupType<IPriceItem> | ColumnType<IPriceItem>)[]>(() => {
    return [
      {
        dataIndex: 'from_weight',
        title: translate('priceSheets.labels.fromWeight'),
      },
      {
        dataIndex: 'to_weight',
        title: translate('priceSheets.labels.toWeight'),
      },
      {
        dataIndex: 'purchase_price',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('priceSheets.labels.purchasePrice'),
      },
      {
        dataIndex: 'sale_price',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('priceSheets.labels.salePrice'),
      },
      {
        dataIndex: 'step_price',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('priceSheets.labels.stepPrice'),
      },
      {
        dataIndex: 'return_fee',
        render: value => <Typography.Text>{StringUtils.convertNumberToCurrency(value)}</Typography.Text>,
        title: translate('priceSheets.labels.returnFee'),
      },
    ];
  }, []);

  return (
    <Create title={translate('priceSheets.titles.createCustomerPrice')} saveButtonProps={saveButtonProps}>
      {formLoading ? (
        <Spin />
      ) : (
        <>
          <Form {...formProps} layout="vertical" autoComplete="on">
            <Form.Item
              wrapperCol={{ span: 14 }}
              label={translate('priceSheets.labels.customer')}
              name={'user_id'}
              rules={[
                {
                  message: 'Vui lòng chọn khách hàng',
                  required: true,
                },
              ]}
            >
              <Select
                options={customerOptions.map(customer => {
                  return {
                    label: customer.username,
                    value: customer.id,
                  };
                })}
                showSearch={true}
                filterOption={(input, option) =>
                  StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                    .trim()
                    .toLowerCase()
                    .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                }
                allowClear
                placeholder={translate('priceSheets.placeholders.customer')}
                loading={isLoadingUsers}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 14 }}
              label={translate('priceSheets.labels.priceSheet')}
              name={'price_sheet_id'}
              rules={[
                {
                  message: 'Vui lòng chọn bảng giá',
                  required: true,
                },
              ]}
            >
              <Select
                {...priceSheetSelectProps}
                placeholder={translate('priceSheets.placeholders.priceSheet')}
                loading={isLoadingPriceSheets}
                onChange={value => {
                  if (priceSheetList) {
                    const priceSheet = priceSheetList.data.find(item => item.id === Number(value));
                    setCarrierName(priceSheet?.carrier?.name || '');
                    setPriceSheetData(priceSheet?.price_items || []);
                  }
                }}
              />
            </Form.Item>
            <Typography.Text italic={true}>{carrierName}</Typography.Text>
          </Form>
          <Table
            dataSource={priceSheetData}
            size={'small'}
            rowKey="uid"
            columns={columns}
            pagination={{
              pageSize: 100,
            }}
          />
        </>
      )}
    </Create>
  );
};
