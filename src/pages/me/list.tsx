import { BankOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { IResourceComponentsProps } from '@refinedev/core';
import { Space, Tabs, TabsProps, Typography } from 'antd';
import React from 'react';

import { AccountInfo } from './components/account-info';
import { Bank } from './components/bank';
import { Password } from './components/password';

export const MeList: React.FC<IResourceComponentsProps> = () => {
  const items: TabsProps['items'] = [
    {
      children: <AccountInfo />,
      key: '1',
      label: (
        <Space direction={'horizontal'}>
          <UserOutlined />
          <Typography.Text>Thông tin tài khoản</Typography.Text>
        </Space>
      ),
    },
    {
      children: <Password />,
      key: '2',
      label: (
        <Space direction={'horizontal'}>
          <LockOutlined />
          <Typography.Text>Mật khẩu</Typography.Text>
        </Space>
      ),
    },
    {
      children: <Bank />,
      key: '3',
      label: (
        <Space direction={'horizontal'}>
          <BankOutlined />
          <Typography.Text>Ngân hàng</Typography.Text>
        </Space>
      ),
    },
  ];
  return <Tabs style={{ width: '100%' }} defaultActiveKey="1" items={items} type="card" />;
};
