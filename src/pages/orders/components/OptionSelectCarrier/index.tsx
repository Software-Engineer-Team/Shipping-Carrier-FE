import { ExclamationOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import React from 'react';

import { GHNIcon, GHTKIcon, NinjavanIcon } from '../../../../components';
import { ICarrier } from '../../../../interfaces/types';
import { StringUtils } from '../../../../utils';

type OptionSelectCarrierProps = {
  carrier: ICarrier;
  conversionRateWeight: number;
  shipmentFee: number;
};
export const OptionSelectCarrier = (props: OptionSelectCarrierProps) => {
  const { carrier, conversionRateWeight, shipmentFee } = props;
  const getIconCarrier = (type: string) => {
    switch (type) {
      case 'GHN':
        return <GHNIcon />;
      case 'GHTK':
        return <GHTKIcon />;
      case 'NINJAVAN':
        return <NinjavanIcon />;
      default:
        return <ExclamationOutlined />;
    }
  };
  return (
    <Space direction={'horizontal'} align={'center'}>
      <Space direction={'horizontal'}>
        {getIconCarrier(carrier.name)}
        <Typography.Text strong>{carrier.name + ' - ' + StringUtils.convertNumberToCurrency(shipmentFee)}</Typography.Text>
      </Space>
      |<Typography.Text>{`Khối lượng quy đổi :`.concat(conversionRateWeight.toString().concat('kg'))}</Typography.Text>
    </Space>
  );
};
