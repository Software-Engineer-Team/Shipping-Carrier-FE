import { Edit, useForm } from '@refinedev/antd';
import { useApiUrl, useCustomMutation } from '@refinedev/core';
import { Form, Input } from 'antd';

import { IUser } from '../../../../interfaces/types';
import { APIEndPoint } from '../../../../utils';

export const Password = () => {
  const apiUrl = useApiUrl();
  const { form, formLoading, formProps, saveButtonProps } = useForm<IUser>({
    action: undefined,
    redirect: false,
    resource: APIEndPoint.AUTH_CHANGE_PASSWORD,
  });

  const { mutate } = useCustomMutation();

  const compareToFirstPassword = (_: any, value: string, callback: (message?: string) => void) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu xác thực không trùng khớp');
    } else {
      callback();
    }
  };
  const handleFinish = async (data: any) => {
    mutate({
      errorNotification: (error, values, resource) => {
        return {
          description: 'Lỗi',
          message: error?.message || 'Lỗi khi cập nhật mật khẩu',
          type: 'error',
        };
      },
      method: 'post',
      successNotification: (data, values, resource) => {
        return {
          description: 'Thành công',
          message: 'Cập nhật mật khẩu thành công',
          type: 'success',
        };
      },
      url: `${apiUrl}/${APIEndPoint.AUTH_CHANGE_PASSWORD}`,
      values: data,
    });
  };
  return (
    <Edit title={'Cập nhật mật khẩu'} saveButtonProps={saveButtonProps} headerButtons={[]} isLoading={formLoading} breadcrumb={undefined}>
      <Form {...formProps} layout={'vertical'} onFinish={handleFinish}>
        <Form.Item
          name={'currentPassword'}
          label={'Mật khẩu hiện tại'}
          rules={[
            {
              message: 'Vui lòng nhập mật khẩu hiện tại!',
              required: true,
            },
          ]}
        >
          <Input.Password placeholder="●●●●●●●●" size="large"></Input.Password>
        </Form.Item>
        <Form.Item
          name={'password'}
          label={'Mật khẩu mới'}
          rules={[
            {
              message: 'Vui lòng nhập mật khẩu mới!',
              required: true,
            },
          ]}
        >
          <Input.Password type="password" placeholder="●●●●●●●●" size="large"></Input.Password>
        </Form.Item>
        <Form.Item
          name={'passwordConfirmation'}
          label={'Nhập lại mật khẩu mới'}
          dependencies={['password']}
          rules={[
            {
              message: 'Vui lòng nhập mật khẩu xác thực!',
              required: true,
            },
            {
              validator: compareToFirstPassword,
            },
          ]}
        >
          <Input.Password type="password" placeholder="●●●●●●●●" size="large"></Input.Password>
        </Form.Item>
      </Form>
    </Edit>
  );
};
