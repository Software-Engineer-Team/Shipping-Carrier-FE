import { Edit, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useParsed } from '@refinedev/core';
import { Form, Input, Select, Switch } from 'antd';
import React from 'react';
import { APIEndPoint } from 'utils';

import { IUser } from '../../interfaces/types';

export const ClientEdit: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const { goBack } = useNavigation();
  const { formProps, saveButtonProps } = useForm<IUser>({
    action: 'edit',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi cập nhật user',
        type: 'error',
      };
    },
    id,
    onMutationSuccess: () => {
      goBack();
    },
    resource: 'users',
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'User được cập nhật thành công',
        type: 'success',
      };
    },
  });

  const { selectProps: selectSaleProps } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'in',
        value: ['admin', 'sale'],
      },
    ],
    optionLabel: 'username',
    optionValue: 'id',
    resource: APIEndPoint.USERS,
  });

  return (
    <Edit resource={APIEndPoint.USERS} title={'Edit khách hàng'} saveButtonProps={saveButtonProps} headerButtons={[]}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Username"
          name={['username']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name={['email']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name={['phone_number']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'sale'}
          label={'Sale'}
          rules={[
            {
              message: 'Vui lòng chọn sale',
              required: true,
            },
          ]}
        >
          <Select {...selectSaleProps} placeholder={'Chọn sale'}></Select>
        </Form.Item>
        <Form.Item name={['blocked']} valuePropName={'checked'} label={'Trạng thái block'}>
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
