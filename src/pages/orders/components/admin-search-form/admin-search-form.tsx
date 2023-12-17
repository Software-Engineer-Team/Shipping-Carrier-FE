import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { SaveButton, useSelect } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Button, Card, Col, DatePicker, Form, FormProps, Row, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint, carrierOptions, orderStatusOptions, orderStatusReconciliationOptions, rangePresets } from '../../../../utils';

const { RangePicker } = DatePicker;
export interface IAdminSearchOrder {
  tracking_id: string;
  to_phone_number: string;
  carrier: number;
  createdAt: [Dayjs, Dayjs];
  end_date: [Dayjs, Dayjs];
  customer: number;
  status: string;
  is_reconciled: boolean;
}

interface ISearchForm {
  searchFormProps: FormProps<IAdminSearchOrder>;
}
export const AdminSearchForm = (props: ISearchForm) => {
  const { searchFormProps } = props;
  const translate = useTranslate();
  const { selectProps } = useSelect<IUser>({
    debounce: 500,
    filters: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    onSearch: value => [
      {
        field: 'username',
        operator: 'containss',
        value,
      },
    ],
    optionLabel: 'username',
    optionValue: 'id',
    resource: APIEndPoint.USERS,
  });

  return (
    <Card title={translate('orders.titles.filter')}>
      <Form
        {...searchFormProps}
        initialValues={{
          createdAt: [dayjs().startOf('day'), dayjs()],
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Form.Item name="tracking_id" label={translate('orders.labels.trackingId')}>
              <Select placeholder={translate('orders.placeholders.trackingId')} mode="tags" style={{ width: '100%' }} allowClear tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="to_phone_number" label={translate('orders.labels.toPhoneNumber')}>
              <Select placeholder={translate('orders.placeholders.toPhoneNumber')} mode="tags" style={{ width: '100%' }} allowClear tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="status" label={translate('orders.labels.orderStatus')}>
              <Select placeholder={translate('orders.placeholders.orderStatus')} mode="tags" allowClear options={orderStatusOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="is_reconciled" label={translate('orders.labels.orderReconciliationStatus')}>
              <Select placeholder={translate('orders.placeholders.orderReconciliationStatus')} allowClear options={orderStatusReconciliationOptions} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item name="carrier" label={translate('orders.labels.carrier')}>
              <Select placeholder={translate('orders.placeholders.carrier')} mode="tags" allowClear options={carrierOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={6}>
            <Form.Item label={translate('orders.labels.customer')} name="customer">
              <Select {...selectProps} allowClear placeholder={translate('orders.placeholders.customer')} showSearch={true} />
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
          <Col xs={24} lg={6}>
            <Form.Item name="end_date" label={translate('orders.labels.endDate')}>
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
            <Space>
              <SaveButton onClick={searchFormProps.form?.submit} icon={<SearchOutlined />}>
                {translate('orders.buttons.search')}
              </SaveButton>
              <Button onClick={() => searchFormProps.form?.resetFields()} icon={<DeleteOutlined />}>
                {translate('orders.buttons.clear')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
