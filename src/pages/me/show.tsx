import { CheckCircleTwoTone, EditOutlined, EllipsisOutlined, MailOutlined, PhoneOutlined, StopTwoTone, UserOutlined } from '@ant-design/icons';
import { IResourceComponentsProps, useGetIdentity } from '@refinedev/core';
import { Avatar, Card, Space, Typography } from 'antd';
import React from 'react';

import { IUser } from '../../interfaces/types';

export const MeShow: React.FC<IResourceComponentsProps> = () => {
  const { data: userData, isLoading } = useGetIdentity<IUser>();
  return (
    <Card title={'Thông tin cá nhân'} loading={isLoading} actions={[<EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}>
      <Space direction="vertical">
        <Space align={'center'} direction="vertical">
          <Avatar shape="square" size={100} icon={<UserOutlined />} />
          <Typography.Title level={1} style={{ margin: 0 }}>
            {userData?.username}
          </Typography.Title>
        </Space>
        <Space align={'start'} direction={'vertical'}>
          <Space direction={'horizontal'}>
            <UserOutlined></UserOutlined>
            <Typography.Text>{userData?.role.name}</Typography.Text>
          </Space>
          <Space direction={'horizontal'}>
            <MailOutlined></MailOutlined>
            <Typography.Text>{userData?.email}</Typography.Text>
          </Space>
          <Space direction={'horizontal'}>
            <PhoneOutlined></PhoneOutlined>
            <Typography.Text>{userData?.phone_number}</Typography.Text>
          </Space>
          <Space direction={'horizontal'}>
            {userData?.blocked ? <StopTwoTone twoToneColor="red" /> : <CheckCircleTwoTone twoToneColor="#52c41a" />}
            <Typography.Text>{userData?.blocked ? 'Đã khoá tài khoản' : 'Tài khoản đã kích hoạt'}</Typography.Text>
          </Space>
        </Space>
      </Space>
    </Card>
  );
};
