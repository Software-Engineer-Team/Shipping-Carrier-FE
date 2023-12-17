import { SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Card, Col, Form, FormProps, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../../utils';

export interface ISearchBank {
  customer: number;
}
interface ISearchForm {
  searchFormProps: FormProps<ISearchBank>;
}
export const SearchForm = (props: ISearchForm) => {
  const { searchFormProps } = props;
  const { form } = searchFormProps;
  const translate = useTranslate();
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);
  const { queryResult } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'in',
        value: ['customer'],
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
