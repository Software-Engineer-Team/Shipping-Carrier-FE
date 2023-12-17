import { Edit, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useParsed, useTranslate } from '@refinedev/core';
import { Form, Input, Select, Spin, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { ICarrierPrice, IPriceItem, IPriceSheet } from 'interfaces/types';
import { useEffect, useMemo, useState } from 'react';
import { APIEndPoint, StringUtils } from 'utils';

export const CustomerPricesEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { id } = useParsed();
  const [priceSheetData, setPriceSheetData] = useState<IPriceItem[]>([]);
  const { goBack } = useNavigation();
  const { formLoading, formProps, saveButtonProps } = useForm<ICarrierPrice>({
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi cập nhật giá khách hàng',
        type: 'error',
      };
    },
    id,
    meta: {
      populate: {
        price_sheet: {
          populate: ['carrier'],
        },
        user: true,
      },
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.USER_PRICE_SHEETS,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Giá khách hàng được cập nhật thành công',
        type: 'success',
      };
    },
  });

  const [carrierName, setCarrierName] = useState<string>('');

  const {
    queryResult: { data, isLoading: isLoadingPriceSheets },
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
    if (data) {
      const priceSheet = data.data.find(item => item.id === Number(id));
      setCarrierName(priceSheet?.carrier?.name || '');
      setPriceSheetData(priceSheet?.price_items || []);
    }
  }, [data, id]);

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
    <Edit title={translate('priceSheets.titles.editCustomerPrice')} saveButtonProps={saveButtonProps} headerButtons={[]}>
      {!formLoading ? (
        <>
          <Form {...formProps} layout="vertical" autoComplete="on">
            <Form.Item
              wrapperCol={{ span: 14 }}
              label={translate('priceSheets.labels.customer')}
              name={['user', 'username']}
              rules={[
                {
                  message: 'Vui lòng chọn bảng giá',
                  required: true,
                },
              ]}
            >
              <Input disabled={true} placeholder={translate('priceSheets.placeholders.customer')} />
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
                  if (data) {
                    const priceSheet = data.data.find(item => item.id === Number(value));
                    setCarrierName(priceSheet?.carrier?.name || '');
                    setPriceSheetData(priceSheet?.price_items || []);
                  }
                }}
              />
            </Form.Item>
            <Typography.Text italic={true}>{carrierName}</Typography.Text>
          </Form>

          <Table dataSource={priceSheetData} size={'small'} rowKey="uid" columns={columns} />
        </>
      ) : (
        <Spin />
      )}
    </Edit>
  );
};
