import { SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { CrudFilters } from '@refinedev/core/dist/interfaces';
import { Button, Card, Col, DatePicker, Form, FormProps, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, StringUtils, rangePresets } from '../../../../utils';
const { RangePicker } = DatePicker;
interface ISearchForm {
  onSubmit?: (filters: CrudFilters) => void;
}
export const SearchForm = (props: ISearchForm) => {
  const { onSubmit } = props;
  const form = Form.useFormInstance();
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

  const handleFinish = (values: any) => {
    const filters: CrudFilters = [];
    if (values.createdAt) {
      filters.push({
        field: 'createdAt',
        operator: 'between',
        value: [values.createdAt[0].startOf('day').toISOString(), values.createdAt[1].endOf('day').toISOString()],
      });
    }
    if (values.customer) {
      filters.push({
        field: 'customer.id',
        operator: 'eq',
        value: values.customer,
      });
    }
    if (values.sale) {
      filters.push({
        field: 'customer.sale.id',
        operator: 'eq',
        value: values.sale,
      });
    }
    onSubmit?.(filters);
  };

  return (
    <Card title={translate('orders.titles.filter')}>
      <Form onFinish={handleFinish} form={form}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Form.Item label={translate('orders.labels.createdAt')} name="createdAt">
              <RangePicker
                style={{ width: '100%' }}
                defaultValue={[dayjs().startOf('d'), dayjs()]}
                presets={rangePresets}
                allowClear
                placeholder={[translate('orders.placeholders.fromDate'), translate('orders.placeholders.toDate')]}
              />
            </Form.Item>
          </Col>
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
            <Form.Item label={translate('orders.labels.sale')} name="sale">
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
            <Button htmlType={'submit'} icon={<SearchOutlined />} type="primary">
              {translate('orders.buttons.search')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
