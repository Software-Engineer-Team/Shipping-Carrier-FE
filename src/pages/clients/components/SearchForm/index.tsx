import { SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Card, Col, Form, FormProps, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../../utils';

export interface ISearchCustomer {
  customer: number;
  sale: number;
  email_or_phone_number: string;
}
interface ISearchForm {
  searchFormProps: FormProps<ISearchCustomer>;
}
export const SearchForm = (props: ISearchForm) => {
  const { searchFormProps } = props;
  const { form } = searchFormProps;
  const translate = useTranslate();
  const [saleOptions, setSaleOptions] = useState<IUser[]>([]);
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);
  const { queryResult } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'in',
        value: ['customer', 'sale', 'admin'],
      },
    ],
    resource: APIEndPoint.USERS,
  });

  useEffect(() => {
    if (queryResult?.data?.data) {
      setSaleOptions(
        queryResult?.data?.data?.filter(user => {
          return user?.role?.type === 'admin' || user?.role?.type === 'sale';
        }),
      );
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
            <Form.Item name="email_or_phone_number" label={translate('form.labels.emailOrPhone')}>
              <Input placeholder={translate('form.placeholders.emailOrPhone')} style={{ width: '100%' }} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item label={translate('form.labels.customer')} name="customer">
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
                placeholder={translate('form.placeholders.customer')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item label={translate('form.labels.sale')} name="sale">
              <Select
                options={saleOptions.map(sale => {
                  return {
                    label: sale.username,
                    value: sale.id,
                  };
                })}
                showSearch={true}
                onClear={() => {
                  form?.setFieldValue('sale', null);
                }}
                filterOption={(input, option) =>
                  StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                    .trim()
                    .toLowerCase()
                    .includes(StringUtils.removeAccents(input).toLowerCase().trim())
                }
                allowClear
                placeholder={translate('orders.placeholders.sale')}
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
