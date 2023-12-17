import { pickNotDeprecated, useActiveAuthProvider, useGetIdentity } from '@refinedev/core';
import { Layout as AntdLayout, Typography, Avatar, Space, theme } from 'antd';
import React from 'react';

import { RefineThemedLayoutV2HeaderProps } from '../types';

const { Text } = Typography;
const { useToken } = theme;

export const ThemedHeaderV2: React.FC<RefineThemedLayoutV2HeaderProps> = ({ isSticky, sticky }) => {
  const { token } = useToken();

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const shouldRenderHeader = user && (user.name || user.avatar);

  if (!shouldRenderHeader) {
    return null;
  }

  const headerStyles: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    height: '64px',
    justifyContent: 'flex-end',
    padding: '0px 24px',
  };

  if (pickNotDeprecated(sticky, isSticky)) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Space size="middle">
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
