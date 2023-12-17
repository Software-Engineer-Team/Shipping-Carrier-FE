import { DropboxOutlined, PhoneFilled } from '@ant-design/icons';
import { Edit, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustomMutation, useNavigation, useParsed, useTranslate } from '@refinedev/core';
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Radio, Row, Space, theme, Tooltip } from 'antd';
import React, { useState } from 'react';

import { SelectAddress } from '../../components';
import { IOrder } from '../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../utils';
import { TagHeader } from './create-order';
import { getMessageTooltips } from './utils/orders';
const MODAL_TEXT_DEFAULT = 'Lưu ý: Chỉ tạo đơn 1 phần đối với Ninjavan. GHN và GHTK hệ thống sẽ tự động khởi tạo. Bạn có muốn thực hiện tác vụ này?';
export const OrdersEdit: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const translate = useTranslate();
  const { useToken } = theme;
  const { token } = useToken();
  const { goBack } = useNavigation();
  const apiUrl = useApiUrl();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(MODAL_TEXT_DEFAULT);
  const { mutate } = useCustomMutation();
  const { form, formLoading, formProps, onFinish, saveButtonProps } = useForm<IOrder>({
    action: 'edit',
    errorNotification: error => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo đơn hàng',
        type: 'error',
      };
    },
    id,
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.ORDERS,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Đơn hàng được cập nhật thành công',
        type: 'success',
      };
    },
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (id) {
      mutate(
        {
          errorNotification: (error, values, resource) => {
            return {
              description: 'Lỗi',
              message: error?.message || 'Lỗi khi tạo đơn giao một phần',
              type: 'error',
            };
          },
          method: 'post',
          successNotification: (data, values, resource) => {
            return {
              description: 'Tạo đơn giao một phần thành công',
              message: 'Thành công',
              type: 'success',
            };
          },
          url: `${apiUrl}/${APIEndPoint.ORDERS_PARTIAL}/${id}`,
          values: {},
        },
        {
          onSuccess: (data, variables, context) => {
            setModalText('Thẻ này sẽ đóng sau 2s');
            setConfirmLoading(true);
            setTimeout(() => {
              setOpen(false);
              setConfirmLoading(false);
            }, 2000);
            setModalText(MODAL_TEXT_DEFAULT);
            goBack();
          },
        },
      );
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    const newValues: any = {};
    newValues['cash_on_delivery'] = values['cash_on_delivery'];
    newValues['to_address'] = values['to_address'];
    newValues['to_name'] = values['to_name'];
    newValues['to_phone_number'] = values['to_phone_number'];
    newValues['to_ward'] = values['to_ward'];
    newValues['to_district'] = values['to_district'];
    newValues['to_province'] = values['to_province'];
    newValues['to_province_code'] = values['to_province_code'];
    newValues['to_district_code'] = values['to_district_code'];
    newValues['to_ward_code'] = values['to_ward_code'];
    newValues['change_fee'] = form.getFieldValue('change_fee');
    newValues['other_fee'] = form.getFieldValue('other_fee');
    await onFinish(newValues);
  };

  const getFromAddress = () => {
    const fromAddress = [];
    for (const [key, value] of Object.entries(form.getFieldsValue(['from_name', 'from_phone_number', 'from_address', 'from_ward', 'from_district', 'from_province']))) {
      fromAddress.push(value);
    }
    return fromAddress.join(', ');
  };

  return (
    <Edit
      title={translate('orders.titles.edit', {
        tracking_id: form.getFieldValue('tracking_id'),
      })}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      headerButtons={[
        <Button
          disabled={form.getFieldValue('is_partial_returned')}
          onClick={() => {
            showModal();
          }}
          key={'active_partial_order'}
        >
          Kích hoạt G1P
        </Button>,
      ]}
      recordItemId={id}
    >
      <Form
        {...formProps}
        layout="horizontal"
        labelAlign="left"
        onFinish={handleSubmit}
        labelWrap
        onFieldsChange={(changedFields, allFields) => {
          console.log('changedFields', changedFields);
        }}
      >
        <Row gutter={[30, 30]}>
          <Col xs={24} xl={12}>
            <Divider orientation={'left'} orientationMargin="0">
              <TagHeader title={translate('orders.titles.receiver')} icon={<i className="fa-solid fa-truck-ramp-box" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item
              label={translate('orders.labels.toName')}
              name="to_name"
              rules={[
                {
                  message: 'Vui lòng nhập tên người nhận',
                  required: true,
                },
              ]}
            >
              <Input allowClear prefix={<i className="fa-solid fa-user"></i>} placeholder={translate('orders.placeholders.toName')} />
            </Form.Item>
            <Form.Item
              label={translate('orders.labels.toPhoneNumber')}
              name="to_phone_number"
              rules={[
                {
                  message: 'Vui lòng nhập đúng số điện thoại',
                  pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                  required: true,
                },
              ]}
            >
              <Input allowClear prefix={<PhoneFilled />} placeholder={translate('orders.placeholders.toPhoneNumber')} />
            </Form.Item>
            <SelectAddress
              nameProvince="to_province"
              nameDistrict="to_district"
              nameWard="to_ward"
              nameAddress="to_address"
              nameProvinceCode="to_province_code"
              nameDistrictCode="to_district_code"
              nameWardCode="to_ward_code"
              labelProvince="form.label.province"
              labelDistrict="form.label.district"
              labelAddress="form.label.address"
              labelWard="form.label.ward"
            />
            <Divider orientation="left" orientationMargin="0">
              <TagHeader title={'Người gửi'} icon={<i className="fa-solid fa-location-dot" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item label={translate('orders.labels.pickInfo')}>
              <Input value={getFromAddress()} disabled={true}></Input>
            </Form.Item>
            <Divider orientation={'left'} orientationMargin="0">
              <TagHeader title={translate('orders.titles.product')} icon={<i className="fa-solid fa-box-open" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item
              label={translate('orders.labels.productName')}
              name="product_name"
              rules={[
                {
                  message: 'Vui lòng nhập tên sản phẩm',
                  required: true,
                },
              ]}
            >
              <Input disabled allowClear prefix={<DropboxOutlined />} />
            </Form.Item>
            <Form.Item
              label={translate('orders.labels.totalWeight')}
              name="weight"
              rules={[
                {
                  message: 'Vui lòng nhập tổng khối lượng',
                  required: true,
                },
              ]}
            >
              <InputNumber disabled min={0} step={0.01} precision={2} addonAfter="kg" />
            </Form.Item>
            <Space direction={'horizontal'}>
              <Form.Item label={translate('orders.labels.length')} name="length">
                <InputNumber disabled min={0} addonAfter="cm" />
              </Form.Item>
              <Form.Item label={translate('orders.labels.width')} name="width">
                <InputNumber disabled min={0} addonAfter="cm" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={translate('orders.labels.height')} name="height">
                <InputNumber disabled min={0} addonAfter="cm" style={{ width: '100%' }} />
              </Form.Item>
            </Space>
          </Col>
          <Col xs={24} xl={12}>
            <Divider orientation={'left'} orientationMargin="0">
              <TagHeader title={translate('orders.titles.parcelInfo')} icon={<i className="fa-solid fa-truck" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item label={translate('orders.labels.cod')} name="cash_on_delivery">
              <InputNumber placeholder={translate('orders.placeholders.cod')} formatter={value => StringUtils.formatterCurrency(value)} min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="payment_type_id" label={translate('orders.labels.paymentType')}>
              <Radio.Group disabled>
                <Space direction={'horizontal'}>
                  <Radio value={1}>Shop trả ship</Radio>
                  <Radio value={2}>Khách trả ship</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={translate('orders.labels.parcelValue')} name="parcel_value" tooltip={<Tooltip>{getMessageTooltips('parcel_value')}</Tooltip>}>
              <InputNumber disabled formatter={value => StringUtils.formatterCurrency(value)} min={0} max={20000000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label={translate('orders.labels.InsuranceFee')} name="has_insurance" valuePropName="checked">
              <Checkbox disabled>
                {translate('orders.labels.hasInsuranceFee')} {'= '.concat(StringUtils.convertNumberToCurrency(form.getFieldValue('insurance_fee'))).concat(' ~ 0.5% Giá trị hàng')}
              </Checkbox>
            </Form.Item>
            <Form.Item label={translate('orders.labels.merchantOrderNumber')} name="merchant_order_number">
              <Input disabled />
            </Form.Item>
            <Form.Item label={translate('orders.labels.deliveryInstructions')} name="delivery_instructions">
              <Input.TextArea disabled></Input.TextArea>
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <TagHeader title={translate('orders.titles.shipmentFee')} icon={<i className="fa-solid fa-wallet" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item name={['carrier', 'name']} label={translate('orders.labels.shipBy')} style={{ width: '100%' }}>
              <Input disabled></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal title="Tạo đơn giao một phần" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>{modalText}</p>
      </Modal>
    </Edit>
  );
};
