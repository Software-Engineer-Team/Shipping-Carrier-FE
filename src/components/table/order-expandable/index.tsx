import { DoubleLeftOutlined, EnvironmentOutlined, FieldTimeOutlined, HomeOutlined } from '@ant-design/icons';
import { DateField } from '@refinedev/antd';
import { useApiUrl, useCustom } from '@refinedev/core';
import { Badge, Card, Col, Row, Space, Timeline, Typography } from 'antd';
import { TimelineItemProps } from 'antd/es/timeline/TimelineItem';
import React, { useEffect, useState } from 'react';

import { IOrder, ITracking, ITrackingResponse } from '../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../utils';
import { CardContent } from '../../card-content';

interface OrderExpandableProps {
  data: IOrder;
  isLoading: boolean;
}
export const OrderExpandable: React.FC<OrderExpandableProps> = ({ data, isLoading }) => {
  const apiUrl = useApiUrl();
  const [trackingList, setTrackingList] = useState<TimelineItemProps[]>([]);
  const { data: dataTracking, isLoading: isLoadingTracking } = useCustom<ITrackingResponse>({
    config: {
      query: {
        trackingId: data?.tracking_id,
      },
    },
    method: 'get',
    queryOptions: {
      enabled: !!data?.tracking_id,
    },
    url: `${apiUrl}/${APIEndPoint.TRACKINGS}`,
  });

  useEffect(() => {
    if (dataTracking) {
      setTrackingList(
        dataTracking?.data?.data?.trackings.map((item, index) => {
          return {
            children: renderContent(item, index === dataTracking?.data?.data?.trackings.length - 1),
            color: index === dataTracking?.data?.data?.trackings.length - 1 ? 'green' : 'gray',
            label: renderDateTime(item.createdAt),
          };
        }),
      );
    }
  }, [dataTracking]);
  const renderDateTime = (value: Date) => {
    return <DateField locales={'vi'} lang={'vi'} value={value} format={'HH:mm, dddd, DD/MM/YYYY'} />;
  };

  const renderContent = (item: ITracking, isStrong: boolean = false) => {
    return (
      <>
        <Typography.Text strong={isStrong}>{item.status}</Typography.Text>
        <br />
        <Typography.Text>{item.description}</Typography.Text>
      </>
    );
  };
  return (
    <Row gutter={[16, 16]} align={'stretch'}>
      <Col lg={8} sm={24} md={24} xs={24}>
        <Card title={'Địa chỉ'} loading={isLoading} type={'inner'} style={{ height: '100%' }}>
          <Space.Compact direction={'vertical'} block size="small">
            <CardContent
              title={'Kho lấy hàng'}
              iconPrefixTitle={<HomeOutlined />}
              subtitle={[data?.from_phone_number, data?.from_address, data.from_ward, data?.from_district, data?.from_province].join(', ')}
            />
            <CardContent
              title={'Địa chỉ nhận'}
              iconPrefixTitle={<EnvironmentOutlined />}
              subtitle={[data?.to_phone_number, data?.to_address, data.to_ward, data?.to_district, data?.to_province].join(', ')}
            />
            <CardContent
              title={'Cập nhật sau cùng'}
              iconPrefixTitle={<FieldTimeOutlined />}
              subtitle={data?.updatedAt && <DateField value={data?.updatedAt} lang={'vi'} locales={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />}
            />
            <CardContent
              title={'Ngày giao hàng thành công'}
              iconPrefixTitle={<FieldTimeOutlined />}
              subtitle={data?.end_date && <DateField value={data?.end_date} lang={'vi'} locales={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />}
            />
            <CardContent title={'Đơn giao một phần'} iconPrefixTitle={<DoubleLeftOutlined />} subtitle={data?.is_partial_returned ? 'Đã kích hoạt' : 'Chưa kích hoạt'} />
          </Space.Compact>
        </Card>
      </Col>
      <Col lg={8} sm={24} md={24} xs={24}>
        <Card title={'Chi tiết đơn'} loading={isLoading} type={'inner'} style={{ height: '100%' }}>
          <Space.Compact direction={'vertical'} block size="small">
            <CardContent title={'Mã tham chiếu đơn hàng'} subtitle={data?.merchant_order_number} />
            <CardContent title={'Cân nặng'} subtitle={data?.weight.toString().concat(' kg')} />
            <CardContent title={'Dài'} subtitle={data?.length && data?.length.toString().concat(' cm')} /> <CardContent title={'Rộng'} subtitle={data?.width && data?.width.toString().concat(' cm')} />
            <CardContent title={'Cao'} subtitle={data?.height && data?.height.toString().concat(' cm')} />
            <CardContent title={'Giá trị kiện hàng'} subtitle={StringUtils.convertNumberToCurrency(data?.parcel_value)} />
            <CardContent title={'Bảo hiểm'} subtitle={StringUtils.convertNumberToCurrency(data?.insurance_fee)} />
            <CardContent title={'Phí hoàn'} subtitle={data?.return_fee} />
            <CardContent title={'Thanh toán'} subtitle={data?.payment_type_id === 1 ? 'Shop trả ship' : 'Khách trả ship'} />
            <CardContent title={'Sản phẩm'} subtitle={data?.product_name} />
            <CardContent title={'Chú thích'} subtitle={data?.delivery_instructions} />
          </Space.Compact>
        </Card>
      </Col>
      <Col lg={8} sm={24} md={24} xs={24}>
        <Card loading={isLoadingTracking} title={`Cập nhật`} extra={<Badge status="processing" text={'Live'} />} type={'inner'} style={{ height: '100%' }}>
          <Timeline reverse mode={'left'} items={trackingList} />
        </Card>
      </Col>
    </Row>
  );
};
