import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';

import { UserOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';
import { Avatar, Layout as AntdLayout, Space, theme, Typography } from 'antd';
import { IUser } from 'interfaces/types';
import React from 'react';

import { ThemedTitleV2Custom } from '../theme-title-v2';
const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();

  const headerStyles: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: token.colorPrimary,
    boxShadow: token.boxShadow,
    display: 'flex',
    height: '64px',
    justifyContent: 'space-between',
    padding: '0px 24px',
  };
  const nameGroupStyles: React.CSSProperties = {
    alignItems: 'self-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 10;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <ThemedTitleV2Custom />
      <Space direction={'horizontal'}>
        <div style={nameGroupStyles}>
          {user?.role.name && <Text style={{ color: token.colorWhite, fontSize: 12 }}>{user.role.name}</Text>}
          {user?.username && (
            <Text strong style={{ color: token.colorWhite }}>
              {user.username}
            </Text>
          )}
        </div>
        <Avatar
          icon={<UserOutlined />}
          size={48}
          style={{
            backgroundColor: token.colorWhite,
            boxShadow: '0 2px 0 #79271e',
            color: token.colorPrimary,
          }}
        />
      </Space>
    </AntdLayout.Header>
  );
};
