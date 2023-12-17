import { SearchOutlined } from '@ant-design/icons';
import { SaveButton } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Card, Col, DatePicker, Form, FormProps, Row, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

import { carrierOptions, orderStatusOptions } from '../../../../utils';

const { RangePicker } = DatePicker;
export interface ISearchCustomerOrder {
  tracking_id: string;
  carrier: number;
  createdAt: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
  status: string;
}

interface ISearchForm {
  searchFormProps: FormProps<ISearchCustomerOrder>;
}
export const CustomerSearchForm = (props: ISearchForm) => {
  const { searchFormProps } = props;
  const translate = useTranslate();
  return (
    <Card title={translate('orders.titles.filter')}>
      <Form
        {...searchFormProps}
        initialValues={{
          createdAt: [dayjs().startOf('month'), dayjs().endOf('month')],
        }}
      >
        <Row gutter={[4, 4]}>
          <Col xs={24} lg={6}>
            <Form.Item name="tracking_id" label={translate('orders.labels.trackingId')}>
              <Select placeholder={translate('orders.placeholders.trackingId')} mode="tags" allowClear style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="status" label={translate('orders.labels.orderStatus')}>
              <Select placeholder={translate('orders.placeholders.orderStatus')} mode="tags" allowClear options={orderStatusOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="carrier" label={translate('orders.labels.carrier')}>
              <Select placeholder={translate('orders.placeholders.carrier')} mode="tags" allowClear options={carrierOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="createdAt" label={translate('orders.labels.createdAt')}>
              <RangePicker style={{ width: '100%' }} allowClear placeholder={[translate('orders.placeholders.fromDate'), translate('orders.placeholders.toDate')]} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="end_date" label={translate('orders.labels.endDate')}>
              <RangePicker allowClear style={{ width: '100%' }} placeholder={[translate('orders.placeholders.fromDate'), translate('orders.placeholders.toDate')]} />
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
