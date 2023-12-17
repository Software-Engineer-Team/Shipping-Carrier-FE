import { FieldTimeOutlined, HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { DateField, DeleteButton, Show } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom, useOne, useParsed } from '@refinedev/core';
import { Card, Col, Divider, Row, Space, Tag, Timeline, Tooltip, Typography } from 'antd';
import React from 'react';

import { IOrder, ITracking, ITrackingResponse } from '../../interfaces/types';
import { APIEndPoint, checkCanCancel, StringUtils } from '../../utils';

interface ICardContent {
  iconPrefixTitle?: React.ReactNode;
  title?: string;
  subtitle?: any;
  copy?: boolean;
}
const CardContent: React.FC<ICardContent> = props => {
  const { copy, iconPrefixTitle, subtitle, title } = props;
  return (
    <Space direction={'horizontal'} align={'baseline'}>
      {iconPrefixTitle && iconPrefixTitle}
      <Typography.Title
        level={5}
        ellipsis={{
          expandable: true,
          rows: 1,
          suffix: ':',
        }}
      >
        {title}
      </Typography.Title>
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
export const OrdersShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const { data: dataOrder, isLoading } = useOne<IOrder>({
    id: id,
    meta: {
      populate: ['carrier'],
    },
    resource: APIEndPoint.ORDERS,
  });

  const { data: dataTracking, isLoading: isLoadingTracking } = useCustom<ITrackingResponse>({
    config: {
      query: {
        trackingId: dataOrder?.data?.tracking_id,
      },
    },
    method: 'get',
    queryOptions: {
      enabled: !!dataOrder?.data?.tracking_id,
    },
    url: `${apiUrl}/${APIEndPoint.TRACKINGS}`,
  });

  const renderDateTime = (value: Date) => {
    return <DateField value={value} format={'HH:mm, dddd, DD/MM/YYYY'} />;
  };

  const renderContent = (item: ITracking) => {
    return (
      <>
        <Typography.Text>{item.status}</Typography.Text>
        <br />
        <Typography.Text>{item.description}</Typography.Text>
      </>
    );
  };

  return (
    <Show
      title={'Chi tiết đơn hàng'}
      headerButtons={[
        <Tooltip title={'Chỉ có thể huỷ đơn hàng ở trạng thái Chờ lấy hàng'} key={'cancel_order'}>
          <DeleteButton disabled={!checkCanCancel(dataOrder?.data)} recordItemId={dataOrder?.data?.id} resource={APIEndPoint.ORDERS_DELETE}>
            Huỷ đơn hàng
          </DeleteButton>
        </Tooltip>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col lg={8} sm={24} md={24} xs={24}>
          <Card
            title={'Mã đơn hàng'}
            extra={
              <Typography.Text
                type={'secondary'}
                copyable={{
                  tooltips: ['Click để copy', 'Đã copy!!'],
                }}
              >
                {dataOrder?.data?.tracking_id}
              </Typography.Text>
            }
            loading={isLoading}
          >
            <Space direction={'vertical'}>
              <CardContent title={'Người gửi'} iconPrefixTitle={<UserOutlined />} subtitle={dataOrder?.data?.from_name} />
              <CardContent title={'Số điện thoại'} iconPrefixTitle={<PhoneOutlined />} subtitle={dataOrder?.data?.from_phone_number} />
              <CardContent
                title={'Địa chỉ'}
                iconPrefixTitle={<HomeOutlined />}
                subtitle={[dataOrder?.data?.from_address, dataOrder?.data.from_ward, dataOrder?.data?.from_district, dataOrder?.data?.from_province].join(', ')}
              />
              <CardContent title={'Ngày tạo'} iconPrefixTitle={<FieldTimeOutlined />} subtitle={<DateField value={dataOrder?.data?.createdAt} format={'HH:mm, dddd, DD/MM/YYYY'} />} />
              <CardContent title={'Cập nhật sau cùng'} iconPrefixTitle={<FieldTimeOutlined />} subtitle={<DateField value={dataOrder?.data?.updatedAt} format={'HH:mm, dddd, DD/MM/YYYY'} />} />
              <CardContent
                title={'Trạng thái'}
                iconPrefixTitle={<FieldTimeOutlined />}
                subtitle={<Tag color={StringUtils.getStatusOrderColor(dataOrder?.data?.status)}>{dataOrder?.data?.status}</Tag>}
              />
            </Space>
          </Card>
        </Col>
        <Col lg={8} sm={24} md={24} xs={24}>
          <Card title={'Thông tin người nhận'} loading={isLoading}>
            <Space direction={'vertical'}>
              <CardContent title={'Người gửi'} iconPrefixTitle={<UserOutlined />} subtitle={dataOrder?.data?.to_name} />
              <CardContent title={'Số điện thoại'} iconPrefixTitle={<PhoneOutlined />} subtitle={dataOrder?.data?.to_phone_number} />
              <CardContent
                title={'Địa chỉ'}
                iconPrefixTitle={<HomeOutlined />}
                subtitle={[dataOrder?.data?.to_address, dataOrder?.data.to_ward, dataOrder?.data?.to_district, dataOrder?.data?.to_province].join(', ')}
              />
              <Divider />
              <CardContent title={'Đơn vị vận chuyển'} subtitle={dataOrder?.data?.carrier?.name} />
              <CardContent title={'Mã tham chiếu đơn hàng'} subtitle={dataOrder?.data?.merchant_order_number} />
              <CardContent title={'Chú thích'} subtitle={dataOrder?.data?.delivery_instructions} />
              <CardContent title={'Thu hộ'} subtitle={StringUtils.formatterCurrency(dataOrder?.data?.cash_on_delivery)} />
              <CardContent title={'Giá trị kiện hàng'} subtitle={StringUtils.formatterCurrency(dataOrder?.data?.parcel_value)} />
              <CardContent title={'Phí vận chuyển'} subtitle={StringUtils.formatterCurrency(dataOrder?.data?.shipment_fee)} />
              <CardContent
                title={'Cân nặng'}
                subtitle={
                  <Typography.Paragraph
                    ellipsis={{
                      suffix: ' kg',
                    }}
                  >
                    {dataOrder?.data?.weight}
                  </Typography.Paragraph>
                }
              />
            </Space>
          </Card>
        </Col>
        <Col lg={8} sm={24} md={24} xs={24}>
          <Card loading={isLoadingTracking} title={`Hành trình đơn hàng`}>
            <Timeline
              mode={'left'}
              items={dataTracking?.data?.data?.trackings.map(item => {
                return {
                  children: renderContent(item),
                  label: renderDateTime(item.createdAt),
                };
              })}
            />
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
