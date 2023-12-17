import { Create, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom, useNavigation } from '@refinedev/core';
import { Form, Input, Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { APIEndPoint } from 'utils';

import { USER_ID_KEY } from '../../constants';
import { IRole } from '../../interfaces/types';

interface IRoleResponse {
  roles: IRole[];
}

export const UsersCreate: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();
  const { form, formProps, onFinish, saveButtonProps } = useForm({
    errorNotification: (data, values, resource) => {
      return {
        description: 'Lỗi',
        message: data?.message || 'Lỗi khi tạo user',
        type: 'error',
      };
    },
    resource: APIEndPoint.USERS,
    successNotification: (data, values, resource) => {
      goBack();
      return {
        description: 'Thành công',
        message: 'User được tạo thành công',
        type: 'success',
      };
    },
  });
  const userId = localStorage.getItem(USER_ID_KEY);
  const apiUrl = useApiUrl();
  const { data: roleData } = useCustom<IRoleResponse>({
    method: 'get',
    url: `${apiUrl}/users-permissions/roles`,
  });
  const [roleOptions, setRoleOptions] = useState<SelectProps['options']>([]);

  useEffect(() => {
    if (roleData) {
      const roleFiltered = roleData.data.roles.filter(role => {
        return !role.type.includes('authenticated') && !role.type.includes('public');
      });
      setRoleOptions(
        roleFiltered.map((role: IRole) => {
          return { label: role.name, value: role.id };
        }) || [],
      );
    }
  }, [roleData]);
  const handleSubmit = async (values: any) => {
    values['sale'] = userId;
    await onFinish(values);
  };

  return (
    <Create title={'Tạo user'} resource="users" saveButtonProps={saveButtonProps}>
      <Form form={form} {...formProps} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} labelAlign="left" labelWrap size={'large'} onFinish={handleSubmit} initialValues={{}}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              message: 'Vui lòng nhập username',
              required: true,
            },
          ]}
        >
          <Input placeholder={'Nhập username'} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              message: 'Vui lòng nhập email',
              required: true,
            },
          ]}
        >
          <Input placeholder={'Nhập địa chỉ email'} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              message: 'Vui lòng nhập password',
              required: true,
            },
            {
              message: 'Mật khẩu không được chứa khoảng trắng',
              pattern: /^\S+$/,
            },
          ]}
        >
          <Input.Password placeholder={'Nhập password'} />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[
            {
              message: 'Vui lòng nhập đúng số điện thoại',
              pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              required: true,
            },
          ]}
        >
          <Input placeholder={'Nhập số điện thoại'} />
        </Form.Item>
        <Form.Item
          label="Role"
          name={'role'}
          rules={[
            {
              message: 'Vui lòng chọn role',
              required: true,
            },
          ]}
        >
          <Select placeholder="Chọn role" style={{ width: '100%' }} options={roleOptions} />
        </Form.Item>
      </Form>
    </Create>
  );
};
