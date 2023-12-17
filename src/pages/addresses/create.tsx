import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Create, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useTranslate } from '@refinedev/core';
import { Form, Input } from 'antd';
import React from 'react';

import { SelectAddress } from '../../components';
import { USER_ID_KEY } from '../../constants';
import { IAddress } from '../../interfaces/types';
import { APIEndPoint } from '../../utils';

export const AddressesCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const userId = localStorage.getItem(USER_ID_KEY);
  const { goBack } = useNavigation();

  const { formProps, onFinish, saveButtonProps } = useForm<IAddress>({
    action: 'create',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo địa chỉ',
        type: 'error',
      };
    },
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.ADDRESSES,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Địa chỉ được tạo thành công',
        type: 'success',
      };
    },
  });

  const handleOnFinish = async (values: any) => {
    values['user'] = userId;
    await onFinish(values);
  };
  return (
    <Create saveButtonProps={saveButtonProps} title={'Tạo địa chỉ mới'}>
      <Form {...formProps} onFinish={handleOnFinish} layout={'vertical'} size={'large'}>
        <Form.Item
          label={translate('orders.labels.fromName')}
          name="from_name"
          rules={[
            {
              message: 'Vui lòng nhập tên người gửi',
              required: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder={translate('orders.placeholders.fromName')} />
        </Form.Item>
        <Form.Item
          label={translate('orders.labels.fromPhoneNumber')}
          name="from_phone_number"
          rules={[
            {
              message: 'Vui lòng nhập đúng số điện thoại',
              pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              required: true,
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder={translate('orders.placeholders.fromPhoneNumber')} />
        </Form.Item>
        <SelectAddress
          nameProvince="from_province"
          nameDistrict="from_district"
          nameWard="from_ward"
          nameAddress="from_address"
          nameProvinceCode="from_province_code"
          nameDistrictCode="from_district_code"
          nameWardCode="from_ward_code"
          labelProvince="form.label.province"
          labelDistrict="form.label.district"
          labelAddress="form.label.address"
          labelWard="form.label.ward"
        />
      </Form>
    </Create>
  );
};
