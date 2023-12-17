import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Edit, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useParsed, useTranslate } from '@refinedev/core';
import { Form, Input, Switch } from 'antd';
import React from 'react';

import { SelectAddress } from '../../components';
import { USER_ID_KEY } from '../../constants';
import { IAddress } from '../../interfaces/types';
import { APIEndPoint } from '../../utils';

export const AddressesEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { goBack } = useNavigation();
  const { id } = useParsed();
  const userId = localStorage.getItem(USER_ID_KEY);

  const { form, formProps, onFinish, saveButtonProps } = useForm<IAddress>({
    action: 'edit',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi cập nhật địa chỉ',
        type: 'error',
      };
    },
    id: id,
    onMutationSuccess: () => {
      goBack();
    },
    resource: APIEndPoint.ADDRESSES,
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'Địa chỉ được cập nhật thành công',
        type: 'success',
      };
    },
  });
  const handleOnFinish = async (values: any) => {
    values['user'] = userId;
    await onFinish(values);
  };
  return (
    <Edit saveButtonProps={saveButtonProps} title={'Chỉnh sửa địa chỉ'}>
      <Form {...formProps} onFinish={handleOnFinish} layout={'vertical'}>
        <Form.Item
          label={translate('orders.labels.toName')}
          name="from_name"
          rules={[
            {
              message: 'Vui lòng nhập tên người nhận',
              required: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label={translate('orders.labels.toPhoneNumber')}
          name="from_phone_number"
          rules={[
            {
              message: 'Vui lòng nhập đúng số điện thoại',
              pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              required: true,
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>
        <Form.Item label={'Mặc định'} name="default">
          <Switch checked={form.getFieldValue('default')} />
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
    </Edit>
  );
};
