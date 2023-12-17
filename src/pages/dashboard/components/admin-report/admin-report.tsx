import { useTranslate } from '@refinedev/core';
import { Card, Col, DatePicker, Divider, Row, Space, Table, theme, Typography } from 'antd';
import { BaseType } from 'antd/es/typography/Base';
import React from 'react';

import { StatusReportDetail } from '../../../../interfaces/types';
import { rangePresets, StringUtils } from '../../../../utils';
import StatisticCard from '../statistic-card';
import { useAdminReport } from './admin-report.hook';
const { RangePicker } = DatePicker;

export const AdminReport: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const translate = useTranslate();
  const { customerOptions, data, endDate, handleOnchangeRangePicker, handleOnTableChange, isLoading, isRefetching, saleOptions, startDate } = useAdminReport();

  const renderContentColumn = (value?: StatusReportDetail, type?: BaseType, isStrong?: boolean) => {
    if (!value) {
      return <Typography.Text>-</Typography.Text>;
    }
    return (
      <Space direction={'vertical'}>
        <Typography.Text type={type} strong={isStrong}>
          {translate('dashboard.titles.totalCOD', { total: StringUtils.convertNumberToCurrency(value?.totalCOD || 0) })}
        </Typography.Text>
        <Typography.Text type={type} strong={isStrong}>
          {translate('dashboard.titles.totalShipmentFee', { total: StringUtils.convertNumberToCurrency(value?.totalShipmentFee || 0) })}
        </Typography.Text>
        <Typography.Text type={type} strong={isStrong}>
          {translate('dashboard.titles.totalOrders', { total: value?.orderIds ? value?.orderIds.length : 0 })}
        </Typography.Text>
      </Space>
    );
  };

  return (
    <Card title={translate('dashboard.titles.list')}>
      <Space>
        <RangePicker defaultValue={[startDate, endDate]} presets={rangePresets} placeholder={['Từ ngày', 'Đến ngày']} onChange={handleOnchangeRangePicker} allowClear={false} />
      </Space>
      <Divider />
      <Row gutter={[16, 16]} wrap={true}>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
          <StatisticCard
            backgroundColor={token.colorPrimary}
            title={translate('dashboard.titles.totalCreatedOrders')}
            cod={data?.data?.data?.totalCreatedOrdersCOD}
            icon={<i className="fa-solid fa-clipboard-list" style={{ color: token.colorWhite }} />}
            shipmentFee={data?.data?.data?.totalCreatedOrdersShipmentFee}
            total={data?.data?.data?.totalCreatedOrders}
            showSkeleton={isLoading || isRefetching}
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
            showSkeleton={isLoading || isRefetching}
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
            showSkeleton={isLoading || isRefetching}
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
            showSkeleton={isLoading || isRefetching}
          />
        </Col>
      </Row>
      <Divider />
      <Table
        loading={isLoading || isRefetching}
        dataSource={data?.data?.data?.ordersByCustomer}
        pagination={{
          showSizeChanger: true,
        }}
        bordered
        onChange={handleOnTableChange}
        size="small"
        rowKey={record => record.customer.id}
        scroll={{ x: 1500 }}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  <Typography.Text strong type={'danger'}>
                    Tổng
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.pending_pickup, 'danger', true)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.delivery_in_progress, 'danger', true)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.delivery_failed, 'danger', true)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.return_to_sender, 'danger', true)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.delivery_successful, 'danger', true)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align={'center'}>
                  {renderContentColumn(data?.data?.data?.totalReportOrdersByStatus?.cancel_order, 'danger', true)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      >
        <Table.Column
          dataIndex={['customer', 'username']}
          align={'center'}
          title={translate('dashboard.fields.customer')}
          filters={customerOptions}
          filterResetToDefaultFilteredValue={true}
          ellipsis={true}
        />
        <Table.Column dataIndex={['customer', 'sale', 'username']} align={'center'} filters={saleOptions} title={translate('dashboard.fields.sale')} />
        <Table.ColumnGroup title={translate('dashboard.fields.status')}>
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'pending_pickup']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.pendingPickup')}</Typography.Text>
                <Typography.Text>{'[1]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'delivery_in_progress']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.deliveryInProgress')}</Typography.Text>
                <Typography.Text>{'[2]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'delivery_failed']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.deliveryFailed')}</Typography.Text>
                <Typography.Text>{'[3]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'return_to_sender']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.returnToSender')}</Typography.Text>
                <Typography.Text>{'[4]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'delivery_successful']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.deliverySucessful')}</Typography.Text>
                <Typography.Text>{'[5]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
          <Table.Column
            dataIndex={['reportOrdersByStatus', 'cancel_order']}
            align={'center'}
            title={
              <Space direction={'vertical'}>
                <Typography.Text>{translate('dashboard.fields.cancelOrder')}</Typography.Text>
                <Typography.Text>{'[6]'}</Typography.Text>
              </Space>
            }
            render={value => renderContentColumn(value)}
          />
        </Table.ColumnGroup>
        <Table.Column dataIndex={'totalOrders'} align={'center'} title={translate('dashboard.fields.totalOrders')} />
      </Table>
    </Card>
  );
};
