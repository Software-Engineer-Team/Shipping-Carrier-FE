import { Edit, useForm } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation } from '@refinedev/core';
import { Form, Input, Switch } from 'antd';
import { APIEndPoint } from 'utils';

import { IUser } from '../../interfaces/types';

export const UsersEdit: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();
  const { formProps, saveButtonProps } = useForm<IUser>({
    errorNotification: (data, values, resource) => {
      return {
        description: 'Lỗi',
        message: data?.message || 'Lỗi khi cập nhật user',
        type: 'error',
      };
    },
    metaData: { populate: ['customer_price', 'carrier_service'] },
    onMutationSuccess: () => {
      goBack();
    },
    successNotification: () => {
      return {
        description: 'Thành công',
        message: 'User được cập nhật thành công',
        type: 'success',
      };
    },
  });

  return (
    <Edit resource={APIEndPoint.USERS} title={'Edit user'} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          wrapperCol={{ span: 8 }}
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
          wrapperCol={{ span: 8 }}
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
          wrapperCol={{ span: 8 }}
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
        <Form.Item name={['blocked']} valuePropName={'checked'} label={'Trạng thái block'}>
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
