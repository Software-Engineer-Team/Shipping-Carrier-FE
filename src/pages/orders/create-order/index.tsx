import { Space, theme, Typography } from 'antd';
import React from 'react';

interface TagHeaderProps {
  title: string;
  icon?: React.ReactNode;
}
export const TagHeader = (props: TagHeaderProps) => {
  const { useToken } = theme;
  const { token } = useToken();
  const { icon, title } = props;
  return (
    <Space direction={'horizontal'}>
      {icon && icon}
      <Typography.Text strong={true} style={{ color: token.colorPrimary, fontSize: 20 }}>
        {title}
      </Typography.Text>
    </Space>
  );
};
