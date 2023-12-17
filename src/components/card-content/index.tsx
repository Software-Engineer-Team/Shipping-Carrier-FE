import { Space, Typography } from 'antd';
import React from 'react';
interface ICardContent {
  iconPrefixTitle?: React.ReactNode;
  title?: string;
  subtitle?: any;
  copy?: boolean;
}

export const CardContent: React.FC<ICardContent> = props => {
  const { copy, iconPrefixTitle, subtitle, title } = props;
  return (
    <Space direction={'horizontal'} align={'baseline'}>
      {iconPrefixTitle && iconPrefixTitle}
      <Typography.Text ellipsis={true} strong>
        {title?.concat(':')}
      </Typography.Text>
      <Typography.Text
        copyable={
          copy && {
            tooltips: ['click here', 'you clicked!!'],
          }
        }
      >
        {subtitle ? subtitle : 'Không có'}
      </Typography.Text>
    </Space>
  );
};
