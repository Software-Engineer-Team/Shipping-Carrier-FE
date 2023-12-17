import { DropboxOutlined, PhoneFilled } from '@ant-design/icons';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { useApiUrl, useCustom, useCustomMutation, useNavigation, useTranslate } from '@refinedev/core';
import { Checkbox, Col, Divider, Form, Grid, Input, InputNumber, Radio, Row, Select, SelectProps, Space, Spin, theme, Tooltip, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { CheckboxOptionType } from 'antd/lib/checkbox';
import React, { useCallback, useEffect, useState } from 'react';

import { IAddressResponse, SelectAddress } from '../../../components/form/select-address';
import { IUser } from '../../../interfaces/types';
import { APIEndPoint, initialFormCreateOrder, StringUtils } from '../../../utils';
import { instructionOptions } from '../../../utils';
import { OptionSelectCarrier } from '../components/OptionSelectCarrier';
import { getFullAddressInfo, getMessageTooltips } from '../utils/orders';
import { CarrierShipmentFeeResponse } from './customer-create-order';
import { TagHeader } from './index';
const { useBreakpoint } = Grid;
export const AdminCreateOrder: React.FC = () => {
  const translate = useTranslate();
  const apiUrl = useApiUrl();
  const { mutate } = useCustomMutation();
  const { goBack } = useNavigation();
  const screens = useBreakpoint();
  const { useToken } = theme;
  const { token } = useToken();

  const [isLoadingShipmentFee, setIsLoadingShipmentFee] = useState(false);
  const [totalFee, setTotalFee] = useState(0);
  const [customerAddressOptions, setCustomerAddressOptions] = useState<SelectProps['options']>();
  const [carrierOptions, setCarrierOptions] = useState<Array<CheckboxOptionType>>();
  const [carrierShipmentFees, setCarrierShipmentFees] = useState<CarrierShipmentFeeResponse[]>([]);
  const [insuranceFee, setInsuranceFee] = useState<number>(0);

  const { form, formLoading, formProps, onFinish, saveButtonProps } = useForm({
    action: 'create',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo đơn hàng',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.ORDERS,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Đơn hàng được tạo thành công',
        type: 'success',
      };
    },
  });

  // watching changes for calculate shipment fee
  const watchHasInsuranceFee = useWatch('has_insurance', form);
  const watchCustomer = useWatch('customer', form);
  const watchWeight = useWatch('weight', form);
  const watchParcelValue = useWatch('parcel_value', form);
  const watchHeight = useWatch('height', form);
  const watchLength = useWatch('length', form);
  const watchWidth = useWatch('width', form);
  const watchToProvinceCode = useWatch('to_province_code', form);
  const watchFromProvinceCode = useWatch('from_province_code', form);
  // watching changes for display total fee
  const watchPaymentTypeId = useWatch('payment_type_id', form);
  const watchCarrier = useWatch('carrier', form);
  const watchCOD = useWatch('cash_on_delivery', form);

  const {
    selectProps: { options: customerOptions },
  } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    optionLabel: 'username',
    optionValue: 'id',
    resource: APIEndPoint.USERS,
  });

  const { data: dataAddresses } = useCustom<IAddressResponse>({
    config: {
      query: {
        user_id: watchCustomer,
      },
    },
    method: 'get',
    queryOptions: {
      enabled: watchCustomer !== undefined,
    },
    url: `${apiUrl}/${APIEndPoint.ADDRESSES}`,
  });

  const setFromUserInfo = useCallback(
    (data: any) => {
      form.setFieldValue('from_province_code', data.from_province_code);
      form.setFieldValue('from_province', data.from_province);
      form.setFieldValue('from_district_code', data.from_district_code);
      form.setFieldValue('from_district', data.from_district);
      form.setFieldValue('from_ward_code', data.from_ward_code);
      form.setFieldValue('from_ward', data.from_ward);
      form.setFieldValue('from_address', data.from_address);
      form.setFieldValue('from_name', data.from_name);
      form.setFieldValue('from_phone_number', data.from_phone_number);
    },
    [form],
  );
  const resetFromUserInfo = useCallback(() => {
    form.setFieldValue('from_province_code', undefined);
    form.setFieldValue('from_province', undefined);
    form.setFieldValue('from_district_code', undefined);
    form.setFieldValue('from_district', undefined);
    form.setFieldValue('from_ward_code', undefined);
    form.setFieldValue('from_ward', undefined);
    form.setFieldValue('from_address', undefined);
    form.setFieldValue('from_name', undefined);
    form.setFieldValue('from_phone_number', undefined);
  }, [form]);

  useEffect(() => {
    if (watchHasInsuranceFee) {
      setInsuranceFee(watchParcelValue * (0.5 / 100));
    } else {
      setInsuranceFee(0);
    }
  }, [watchHasInsuranceFee, watchParcelValue]);

  useEffect(() => {
    if (dataAddresses?.data?.data) {
      resetFromUserInfo();
      const data = dataAddresses?.data?.data.map((item, index) => {
        return {
          label: `Địa chỉ ${index}: ${getFullAddressInfo(item)}`,
          value: item.id,
        };
      });
      setCustomerAddressOptions(data);
    }
  }, [dataAddresses?.data?.data, resetFromUserInfo]);

  useEffect(() => {
    setTotalFee(0);
    if (watchFromProvinceCode && watchToProvinceCode && watchWeight && watchCustomer) {
      setIsLoadingShipmentFee(true);
      mutate(
        {
          errorNotification: (data, values) => {
            return {
              description: 'Lỗi',
              message: data?.message || '',
              type: 'error',
            };
          },
          method: 'post',
          url: `${apiUrl}${APIEndPoint.SHIPMENT_FEE}/${watchCustomer}`,
          values: {
            from_province_code: watchFromProvinceCode,
            has_insurance: watchHasInsuranceFee,
            height: watchHeight,
            length: watchLength,
            parcel_value: watchParcelValue,
            to_province_code: watchToProvinceCode,
            weight: watchWeight,
            width: watchWidth,
          },
        },
        {
          onError: () => {
            setIsLoadingShipmentFee(false);
            setTotalFee(0);
            setCarrierOptions([]);
            setCarrierShipmentFees([]);
          },
          onSuccess: (data, variables, context) => {
            setTotalFee(0);
            setCarrierShipmentFees(data.data.data);
            setCarrierOptions(
              data.data.data.map((e: CarrierShipmentFeeResponse) => {
                return {
                  label: <OptionSelectCarrier carrier={e.carrier} conversionRateWeight={e.conversionRateWeight} shipmentFee={e.shipmentFee}></OptionSelectCarrier>,
                  value: e.carrier.name,
                };
              }),
            );
            setIsLoadingShipmentFee(false);
          },
        },
      );
    }
  }, [watchHasInsuranceFee, watchCustomer, watchParcelValue, watchWeight, watchFromProvinceCode, watchToProvinceCode, watchHeight, watchLength, watchWidth, mutate, apiUrl]);

  useEffect(() => {
    const carrierShipmentFee = carrierShipmentFees.find(e => e.carrier.name === watchCarrier);
    if (carrierShipmentFee) {
      setTotalFee(watchPaymentTypeId === 1 ? watchCOD : watchCOD + carrierShipmentFee.shipmentFee);
    }
  }, [watchCarrier, watchCOD, watchPaymentTypeId, carrierShipmentFees]);

  const onChangeCustomerSelectAddress = (value: number) => {
    const userAddress = dataAddresses?.data?.data?.find(item => item.id === value);
    if (userAddress) {
      setFromUserInfo(userAddress);
    }
  };
  const handleSubmit = async (values: any) => {
    if (values['delivery_instructions']) {
      values['delivery_instructions'] = values['delivery_instructions'].join('. ');
    }
    await onFinish(values);
  };

  return (
    <Create title={'Tạo đơn hàng'} saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form form={form} {...formProps} layout="vertical" labelAlign="left" onFinish={handleSubmit} labelWrap size={'large'} initialValues={initialFormCreateOrder}>
        <Row gutter={[16, 16]}>
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
              <Input prefix={<i className="fa-solid fa-user"></i>} placeholder={translate('orders.placeholders.toName')} />
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
              <Input prefix={<PhoneFilled />} placeholder={translate('orders.placeholders.toPhoneNumber')} />
            </Form.Item>
            <SelectAddress
              nameProvince="to_province"
              nameDistrict="to_district"
              nameWard="to_ward"
              nameAddress="to_address"
              nameProvinceCode="to_province_code"
              nameDistrictCode="to_district_code"
              nameWardCode="to_ward_code"
              labelProvince="form.labels.province"
              labelDistrict="form.labels.district"
              labelAddress="form.labels.address"
              labelWard="form.labels.ward"
            />
            <Divider orientation="left" orientationMargin="0">
              <TagHeader title={'Người gửi'} icon={<i className="fa-solid fa-location-dot" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item
              label={translate('orders.labels.customer')}
              name="customer"
              rules={[
                {
                  message: 'Vui lòng chọn khách hàng',
                  required: true,
                },
              ]}
            >
              <Select options={customerOptions} placeholder={'Chọn khách hàng'} />
            </Form.Item>
            <Form.Item label={translate('orders.labels.pickInfo')} shouldUpdate>
              <Select
                suffixIcon={<i className="fa-solid fa-truck-ramp-box"></i>}
                placeholder={translate('orders.placeholders.fromName')}
                options={customerAddressOptions}
                onChange={onChangeCustomerSelectAddress}
              />
            </Form.Item>
            <Form.Item name={'from_province'} hidden shouldUpdate />
            <Form.Item name={'from_province_code'} hidden shouldUpdate />
            <Form.Item name={'from_district'} hidden shouldUpdate />
            <Form.Item name={'from_district_code'} hidden shouldUpdate />
            <Form.Item name={'from_ward'} hidden shouldUpdate />
            <Form.Item name={'from_ward_code'} hidden shouldUpdate />
            <Form.Item name={'from_address'} hidden shouldUpdate />
            <Form.Item name={'from_name'} hidden shouldUpdate />
            <Form.Item name={'from_phone_number'} hidden shouldUpdate />
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
              <Input prefix={<DropboxOutlined />} placeholder={translate('orders.placeholders.productName')} />
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
              <InputNumber placeholder={translate('orders.placeholders.weight')} min={0} step={0.01} precision={2} addonAfter="kg" style={{ width: '100%' }} />
            </Form.Item>
            <Space direction={screens.xs ? 'vertical' : 'horizontal'} style={{ width: '100%' }}>
              <Form.Item label={translate('orders.labels.length')} name="length">
                <InputNumber placeholder={translate('orders.placeholders.length')} min={0} addonAfter="cm" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={translate('orders.labels.width')} name="width">
                <InputNumber placeholder={translate('orders.placeholders.width')} min={0} addonAfter="cm" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={translate('orders.labels.height')} name="height">
                <InputNumber placeholder={translate('orders.placeholders.height')} min={0} addonAfter="cm" style={{ width: '100%' }} />
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
              <Radio.Group>
                <Space direction={'horizontal'}>
                  <Radio value={1}>Shop trả ship</Radio>
                  <Radio value={2}>Khách trả ship</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={translate('orders.labels.parcelValue')} name="parcel_value" tooltip={<Tooltip>{getMessageTooltips('parcel_value')}</Tooltip>}>
              <InputNumber placeholder={translate('orders.placeholders.parcelValue')} formatter={value => StringUtils.formatterCurrency(value)} min={0} max={20000000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label={translate('orders.labels.InsuranceFee')} name="has_insurance" valuePropName="checked">
              <Checkbox>
                {translate('orders.labels.hasInsuranceFee')} {insuranceFee ? '= '.concat(StringUtils.convertNumberToCurrency(insuranceFee)).concat(' ~ 0.5% Giá trị hàng') : null}
              </Checkbox>
            </Form.Item>
            <Form.Item
              label={translate('orders.labels.merchantOrderNumber')}
              name="merchant_order_number"
              rules={[
                {
                  message: 'Vui lòng nhập đúng định dạng',
                  pattern: /^([a-zA-Z0-9]+[-])*[a-zA-Z0-9]+$/,
                },
              ]}
            >
              <Input placeholder={translate('orders.placeholders.merchantOrderNumber')} />
            </Form.Item>
            <Form.Item label={translate('orders.labels.deliveryInstructions')} name="delivery_instructions">
              <Select placeholder={translate('orders.placeholders.deliveryInstructions')} mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} options={instructionOptions} />
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <TagHeader title={translate('orders.titles.shipmentFee')} icon={<i className="fa-solid fa-wallet" style={{ color: token.colorPrimary }}></i>} />
            </Divider>
            <Form.Item
              name="carrier"
              label={translate('orders.labels.shipBy')}
              rules={[
                {
                  message: 'Vui lòng chọn đơn vị vận chuyển',
                  required: true,
                },
              ]}
              style={{ width: '100%' }}
            >
              {isLoadingShipmentFee ? <Spin /> : carrierOptions?.length ? <Radio.Group options={carrierOptions}></Radio.Group> : <Typography.Text>Chưa có thông tin</Typography.Text>}
            </Form.Item>
            <Divider orientation={'left'}></Divider>
            <Form.Item label={translate('orders.labels.totalFee')} style={{ fontWeight: 'bold' }} tooltip={<Tooltip>{getMessageTooltips('total_fee')}</Tooltip>}>
              <span className="ant-form-text">{StringUtils.convertNumberToCurrency(totalFee)}</span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
