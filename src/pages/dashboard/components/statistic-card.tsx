import { Card, Space, Statistic, theme, Tooltip, Typography } from 'antd';
import React from 'react';
import CountUp from 'react-countup';

interface StatisticCardProps {
  title?: string;
  description?: string;
  cod?: number;
  shipmentFee?: number;
  total?: number;
  colorCod?: string;
  colorShipmentFee?: string;
  backgroundColor?: string;
  icon?: React.ReactNode;
  showSkeleton?: boolean;
}
const StatisticCard = (props: StatisticCardProps) => {
  const { useToken } = theme;
  const { token } = useToken();
  const {
    backgroundColor = token.colorPrimary,
    cod = 0,
    colorCod = token.colorWhite,
    colorShipmentFee = token.colorWhite,
    description = '',
    icon,
    shipmentFee = 0,
    showSkeleton = false,
    title = '',
    total = 0,
  } = props;
  return (
    <Tooltip title={description}>
      <Card
        loading={showSkeleton}
        headStyle={{
          backgroundColor: backgroundColor,
          color: token.colorWhite,
          textTransform: 'uppercase',
        }}
        bodyStyle={{ backgroundColor: backgroundColor }}
        title={title}
        extra={
          <Space style={{ fontSize: 24 }}>
            <Typography.Text
              strong
              style={{
                color: token.colorWhite,
                fontSize: 16,
              }}
            >
              {total && total.toString()} đơn
            </Typography.Text>
            {icon}
          </Space>
        }
      >
        <Statistic value={cod} prefix={'COD'} suffix={'đ'} valueStyle={{ color: colorCod }} formatter={(value: string | number) => <CountUp start={0} end={Number(value)} separator="." />} />
        <Statistic
          value={shipmentFee}
          prefix={'Ship'}
          suffix={'đ'}
          valueStyle={{ color: colorShipmentFee }}
          formatter={(value: string | number) => <CountUp start={0} end={Number(value)} separator="." />}
        />
      </Card>
    </Tooltip>
  );
};

export default React.memo(StatisticCard);
