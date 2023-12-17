import { useTranslate } from '@refinedev/core';
import { Button, Col, DatePicker, Drawer, Flex, Form, Row, Select, Space } from 'antd';
import { useCallback } from 'react';

import { carrierOptions, orderStatusOptions, orderStatusReconciliationOptions, rangePresets, StringUtils } from '../../../../utils';
import { useAdminExportForm } from './admin-export-form.hook';

const { RangePicker } = DatePicker;
interface IAdminExportForm {
  isModalOpen: boolean;
  handleCancel: () => void;
}
export const AdminExportForm = (props: IAdminExportForm) => {
  const { handleCancel, isModalOpen } = props;
  const translate = useTranslate();
  const { customerOptions, form, handleResetForm, handleSubmit, isFetching, onFinish } = useAdminExportForm();

  const onCloseDrawer = useCallback(() => {
    handleResetForm();
    handleCancel();
  }, [handleCancel, handleResetForm]);

  return (
    <Drawer destroyOnClose={true} title="Xuất dữ liệu đơn hàng" width={720} open={isModalOpen} onClose={onCloseDrawer}>
      <Form form={form} onFinish={onFinish} layout={'vertical'}>
        <Row gutter={[16, 0]}>
          <Col xs={24} xl={24} lg={24}>
            <Form.Item name="status" label={translate('orders.labels.orderStatus')}>
              <Select placeholder={translate('orders.placeholders.orderStatus')} mode="tags" allowClear options={orderStatusOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} xl={24} lg={24}>
            <Form.Item name="is_reconciled" label={translate('orders.labels.orderReconciliationStatus')}>
              <Select placeholder={translate('orders.placeholders.orderReconciliationStatus')} allowClear options={orderStatusReconciliationOptions} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} xl={24} lg={24}>
            <Form.Item name="carrier" label={translate('orders.labels.carrier')}>
              <Select placeholder={translate('orders.placeholders.carrier')} mode="tags" allowClear options={carrierOptions} style={{ width: '100%' }} tokenSeparators={[' ']} />
            </Form.Item>
          </Col>
          <Col xs={24} xl={24} lg={24}>
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
          <Col xs={24} xl={24} lg={24}>
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
          <Col xs={24} xl={24} lg={24}>
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
          <Col xs={24} xl={24} lg={24}>
            <Space align={'center'}>
              <Button onClick={handleResetForm}> {translate('orders.buttons.clear')}</Button>
              <Button onClick={handleSubmit} type="primary" loading={isFetching}>
                {translate('orders.buttons.export')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
