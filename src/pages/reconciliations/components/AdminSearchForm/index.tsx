import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Button, Card, Col, DatePicker, Flex, Form, FormProps, Row, Select, Space, TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, carrierOptions, orderStatusOptions, rangePresets, reconciliationStatusOptions, StringUtils } from '../../../../utils';

const { RangePicker } = DatePicker;
export interface IAdminSearchReconciliation {
  createdAt: [Dayjs, Dayjs];
  updatedAt: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
  customer: number;
  status: string;
}

interface ISearchForm {
  searchFormProps: FormProps<IAdminSearchReconciliation>;
}
export const AdminSearchForm = (props: ISearchForm) => {
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
      <Form
        {...searchFormProps}
        initialValues={{
          createdAt: [dayjs().subtract(7, 'day'), dayjs().endOf('day')],
          status: 'pending',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Form.Item name="status">
              <Select placeholder={translate('reconciliations.placeholders.status')} allowClear options={reconciliationStatusOptions} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="customer">
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
                placeholder={translate('reconciliations.placeholders.customer')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="createdAt">
              <RangePicker
                style={{ width: '100%' }}
                presets={rangePresets}
                format={'DD-MM-YYYY'}
                allowClear
                placeholder={[translate('reconciliations.placeholders.createdAt'), translate('orders.placeholders.toDate')]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="updatedAt">
              <RangePicker
                style={{ width: '100%' }}
                presets={rangePresets}
                format={'DD-MM-YYYY'}
                allowClear
                placeholder={[translate('reconciliations.placeholders.updatedAt'), translate('orders.placeholders.toDate')]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={3}>
            <Space>
              <SaveButton onClick={searchFormProps.form?.submit} icon={<SearchOutlined />}>
                {translate('reconciliations.buttons.search')}
              </SaveButton>
              <Button onClick={() => searchFormProps.form?.resetFields()} icon={<DeleteOutlined />}>
                {translate('reconciliations.buttons.clear')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
