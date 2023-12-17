import { SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Card, Col, DatePicker, Form, FormProps, Row, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, carrierOptions, orderStatusOptions, rangePresets, reconciliationStatusOptions, StringUtils } from '../../../../utils';

const { RangePicker } = DatePicker;
export interface ISaleSearchReconciliation {
  createdAt: [Dayjs, Dayjs];
  updatedAt: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
  customer: number;
  status: string;
}

interface ISearchForm {
  searchFormProps: FormProps<ISaleSearchReconciliation>;
}
export const SaleSearchForm = (props: ISearchForm) => {
  const { searchFormProps } = props;
  const { form } = searchFormProps;
  const translate = useTranslate();
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);

  const { queryResult } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    resource: APIEndPoint.USERS,
  });

  useEffect(() => {
    if (queryResult?.data?.data) {
      setCustomerOptions(
        queryResult?.data?.data?.filter(user => {
          return user?.role?.type === 'customer';
        }),
      );
    }
  }, [queryResult?.data?.data]);

  return (
    <Card title={translate('orders.titles.filter')}>
      <Form {...searchFormProps}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Form.Item label={translate('orders.labels.customer')} name="customer">
              <Select
                options={customerOptions.map(customer => {
                  return {
                    label: customer.username,
                    value: customer.id,
                  };
                })}
                onClear={() => {
                  form?.setFieldValue('customer', null);
                }}
                showSearch={true}
                filterOption={(input, option) =>
                  StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                    .trim()
                    .toLowerCase()
                    .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                }
                allowClear
                placeholder={translate('orders.placeholders.customer')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="createdAt" label={translate('orders.labels.createdAt')}>
              <RangePicker
                style={{ width: '100%' }}
                presets={rangePresets}
                format={'DD-MM-YYYY'}
                allowClear
                placeholder={[translate('orders.placeholders.fromDate'), translate('orders.placeholders.toDate')]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={3}>
            <SaveButton onClick={searchFormProps.form?.submit} icon={<SearchOutlined />}>
              {translate('orders.buttons.search')}
            </SaveButton>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
