import { Col, Descriptions, theme, Typography } from 'antd';
import React, { CSSProperties } from 'react';

interface InfoCardProps {
  title: string | undefined;
  description: string | undefined;
  iconTitle?: React.ReactNode;
}
export const InfoCard = ({ description, iconTitle, title = '' }: InfoCardProps) => {
  const { useToken } = theme;
  const { token } = useToken();

  const containerStyle: CSSProperties = {
    backgroundColor: token.colorBgElevated,
    border: '1px solid #e0e0e0',
    borderRadius: token.borderRadius,
    boxSizing: 'border-box',
    padding: token.padding,
    position: 'relative',
  };

  const titleStyle: CSSProperties = {
    backgroundColor: token.colorBgElevated,
    padding: '0.4rem 2rem',
  };

  return (
    <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
      <div style={containerStyle}>
        <div style={titleStyle}>
          {iconTitle && iconTitle}
          <Typography.Text strong>{title}</Typography.Text>
        </div>
        <Descriptions layout={'horizontal'} column={1} style={{ marginTop: 10 }}>
          <Descriptions.Item label={title}>{description}</Descriptions.Item>
        </Descriptions>
      </div>
    </Col>
  );
};
