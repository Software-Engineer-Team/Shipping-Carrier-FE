import { UserOutlined } from '@ant-design/icons';
import { Edit, useForm } from '@refinedev/antd';
import { Avatar, Col, Form, Input, Row, Space } from 'antd';

import { USER_ID_KEY } from '../../../../constants';
import { IUser } from '../../../../interfaces/types';
import { APIEndPoint } from '../../../../utils';

export const AccountInfo = () => {
  const { formLoading, formProps, saveButtonProps } = useForm<IUser>({
    action: 'edit',
    id: Number(localStorage.getItem(USER_ID_KEY)),
    redirect: false,
    resource: APIEndPoint.USERS,
  });

  return (
    <Edit title={'Chỉnh sửa tài khoản'} saveButtonProps={saveButtonProps} headerButtons={[]} isLoading={formLoading} breadcrumb={undefined}>
      <Form {...formProps} layout={'vertical'} size={'large'} disabled={true}>
        <Row gutter={[16, 16]}>
          <Col lg={4} style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Avatar shape="circle" size={150} icon={<UserOutlined />} />
            </Space>
          </Col>
          <Col lg={20}>
            <Form.Item name={'username'} label={'Tên người dùng'}>
              <Input placeholder={'Nhập địa chỉ email'}></Input>
            </Form.Item>
            <Form.Item name={'email'} label={'Email'} required={true}>
              <Input placeholder={'Nhập tên người dùng'}></Input>
            </Form.Item>
            <Form.Item name={'phone_number'} label={'Số điện thoại'} required={true}>
              <Input placeholder={'Nhập số điện thoại'}></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};
