import { Pie } from '@ant-design/plots';
import { DateField, List } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Badge, Card, Col, DatePicker, Divider, Row, Space, theme, Typography, List as ListAnt } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { rangePresets, StringUtils } from '../../../../utils';
import StatisticCard from '../statistic-card';
import { useCustomerReport } from './customer-report.hook';
const { RangePicker } = DatePicker;

export const CustomerReport: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const translate = useTranslate();
  const { config, data, endDate, handleOnRangePickerChange, isFetching, isLoading, listStatus, startDate } = useCustomerReport();

  return (
    <List title={translate('dashboard.titles.list')}>
      <Card
        title={translate('dashboard.titles.status')}
        extra={
          <Badge text={'Live'} dot status="processing">
            <DateField value={dayjs()} lang={'vi'} locales={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />
          </Badge>
        }
      >
        <Space direction={'horizontal'}>
          <RangePicker defaultValue={[startDate, endDate]} presets={rangePresets} placeholder={['Từ ngày', 'Đến ngày']} onChange={handleOnRangePickerChange} allowClear={false} />
        </Space>
        <Divider />
        <Row gutter={[30, 30]}>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
            <StatisticCard
              backgroundColor={token.colorPrimary}
              title={translate('dashboard.titles.totalCreatedOrders')}
              cod={data?.data?.data?.totalCreatedOrdersCOD}
              icon={<i className="fa-solid fa-clipboard-list" style={{ color: token.colorWhite }} />}
              shipmentFee={data?.data?.data?.totalCreatedOrdersShipmentFee}
              total={data?.data?.data?.totalCreatedOrders}
              showSkeleton={isLoading || isFetching}
            />
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
            <StatisticCard
              backgroundColor={'#108ee9'}
              title={translate('dashboard.titles.totalPendingPickupOrders')}
              cod={data?.data?.data?.totalPendingPickupOrdersCOD}
              icon={<i className="fa-solid fa-boxes-packing" style={{ color: token.colorWhite }} />}
              shipmentFee={data?.data?.data?.totalPendingPickupOrdersShipmentFee}
              total={data?.data?.data?.totalPendingPickupOrders}
              showSkeleton={isLoading || isFetching}
            />
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
            <StatisticCard
              backgroundColor={'#ef5e09'}
              title={translate('dashboard.titles.totalReceivedOrders')}
              cod={data?.data?.data?.totalReceivedOrdersCOD}
              icon={<i className="fa-solid fa-truck-moving" style={{ color: token.colorWhite }} />}
              shipmentFee={data?.data?.data?.totalReceivedOrdersShipmentFee}
              total={data?.data?.data?.totalReceivedOrders}
              showSkeleton={isLoading || isFetching}
            />
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
            <StatisticCard
              backgroundColor={'#328207'}
              title={translate('dashboard.titles.totalDeliverySuccessfulOrders')}
              cod={data?.data?.data?.totalDeliverySuccessfulOrdersCOD}
              icon={<i className="fa-solid fa-circle-check" style={{ color: token.colorWhite }} />}
              shipmentFee={data?.data?.data?.totalDeliverySuccessfulOrdersShipmentFee}
              total={data?.data?.data?.totalDeliverySuccessfulOrders}
              showSkeleton={isLoading || isFetching}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={24} md={24} lg={8} xl={12} xxl={12}>
            <Card title={translate('dashboard.titles.detail')}>
              <ListAnt
                loading={isLoading || isFetching}
                rowKey={item => item.title}
                dataSource={listStatus}
                renderItem={(item, index) => (
                  <ListAnt.Item>
                    <ListAnt.Item.Meta
                      title={item.title}
                      description={
                        <Space direction={'vertical'}>
                          <Typography.Text>{translate('dashboard.titles.totalOrders', { total: item.status?.orderIds.length })}</Typography.Text>
                          <Typography.Text>{translate('dashboard.titles.totalCOD', { total: StringUtils.convertNumberToCurrency(item.status?.totalCOD || 0) })}</Typography.Text>
                          <Typography.Text>{translate('dashboard.titles.totalShipmentFee', { total: StringUtils.convertNumberToCurrency(item.status?.totalShipmentFee || 0) })}</Typography.Text>
                        </Space>
                      }
                    />
                  </ListAnt.Item>
                )}
              ></ListAnt>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={12}>
            <Card title={translate('dashboard.titles.orderRatio')} style={{ height: '100%' }}>
              <Pie {...config} loading={isFetching || isLoading} />
            </Card>
          </Col>
        </Row>
      </Card>
    </List>
  );
};
