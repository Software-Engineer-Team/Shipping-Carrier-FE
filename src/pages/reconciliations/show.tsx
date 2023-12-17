import { ExportOutlined } from '@ant-design/icons';
import { DateField, Show } from '@refinedev/antd';
import { IResourceComponentsProps, useCan, useOne, useParsed, useTranslate } from '@refinedev/core';
import { Button, Card, Col, Divider, Row, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IReconciliation, IReconciliationOrder } from 'interfaces/types';
import React, { useCallback, useMemo } from 'react';

import { CardContent } from '../../components';
import { APIEndPoint, columnsExportReconciliationAdmin, columnsExportReconciliationCustomer, exportToExcel, StringUtils } from '../../utils';

export const ReconciliationsShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const translate = useTranslate();
  const { data, isLoading } = useOne<IReconciliation>({
    id: id,
    resource: APIEndPoint.RECONCILIATIONS_PROFIT,
  });

  const { data: canAccess } = useCan({
    action: 'field',
    params: { field: 'revenue' },
    resource: 'reconciliations',
  });

  const handleExportExcel = useCallback(() => {
    if (data?.data?.reconciliation_orders) {
      exportToExcel(
        data?.data?.reconciliation_orders,
        canAccess?.can ? columnsExportReconciliationAdmin : columnsExportReconciliationCustomer,
        `BSS_Danh sách đối soát_${dayjs().format('DDMMYYYY_HHmmss')}`,
      );
    }
  }, [canAccess?.can, data?.data?.reconciliation_orders]);

  const columns = useMemo<(ColumnGroupType<IReconciliationOrder> | ColumnType<IReconciliationOrder>)[]>(() => {
    return [
      {
        dataIndex: 'tracking_id',
        render: value => {
          return (
            <Typography.Paragraph
              copyable={{
                tooltips: ['Copy mã đơn hàng', 'Đã copy'],
              }}
            >
              {value}
            </Typography.Paragraph>
          );
        },
        title: translate('reconciliations.fields.trackingId'),
        width: 150,
      },
      {
        dataIndex: 'status',
        title: translate('reconciliations.fields.status'),
        width: 150,
      },
      {
        dataIndex: 'start_date',
        render: value => {
          return value && <DateField value={value} format={'DD-MM-YYYY'} />;
        },
        title: translate('reconciliations.fields.startDate'),
        width: 150,
      },
      {
        dataIndex: 'end_date',
        render: value => {
          return value && <DateField value={value} format={'DD-MM-YYYY'} />;
        },
        title: translate('reconciliations.fields.endDate'),
        width: 150,
      },
      {
        dataIndex: ['carrier', 'name'],
        title: translate('reconciliations.fields.carrier'),
        width: 150,
      },
      {
        dataIndex: 'payment_type_id',
        render: value => {
          if (!value) {
            return '-';
          }
          return value === 1 ? 'Shop trả ship' : 'Khách trả ship';
        },
        title: translate('reconciliations.fields.paymentType'),
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'weight',
        title: translate('reconciliations.fields.weight'),
        width: 150,
      },
      ...(canAccess?.can
        ? [
            {
              align: 'center',
              dataIndex: 'partner_cash_on_delivery',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerCashOnDelivery'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
            {
              align: 'center',
              dataIndex: 'partner_shipment_fee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerShipmentFee'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
            {
              align: 'center',
              dataIndex: 'partner_return_fee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerReturnFee'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
            {
              align: 'center',
              dataIndex: 'partner_insurance_fee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerInsuranceFee'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
            {
              align: 'center',
              dataIndex: 'partner_change_fee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerChangeFee'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
            {
              align: 'center',
              dataIndex: 'partner_other_fee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: translate('reconciliations.fields.partnerOtherFee'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
          ]
        : []),
      {
        align: 'center',
        dataIndex: 'system_cash_on_delivery',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemCashOnDelivery'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'system_shipment_fee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemShipmentFee'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'system_return_fee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemReturnFee'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'system_insurance_fee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemInsuranceFee'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'system_change_fee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemChangeFee'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'system_other_fee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliations.fields.systemOtherFee'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      {
        align: 'center',
        dataIndex: 'customer_refund',
        fixed: 'right',
        render: value => (
          <Typography.Paragraph strong style={{ color: 'red', margin: 0 }}>
            {StringUtils.convertNumberToCurrency(value)}
          </Typography.Paragraph>
        ),
        title: translate('reconciliations.fields.totalCustomerRefund'),
        width: 150,
      } as ColumnType<IReconciliationOrder>,
      ...(canAccess?.can
        ? [
            {
              align: 'center',
              dataIndex: 'system_revenue',
              fixed: 'right',
              render: value => (
                <Typography.Paragraph strong style={{ color: 'red', margin: 0 }}>
                  {StringUtils.convertNumberToCurrency(value)}
                </Typography.Paragraph>
              ),
              title: translate('reconciliations.fields.totalSystemRevenue'),
              width: 150,
            } as ColumnType<IReconciliationOrder>,
          ]
        : []),
    ];
  }, [canAccess?.can, translate]);

  return (
    <Show
      title={translate('reconciliations.titles.show')}
      headerButtons={[
        <Button icon={<ExportOutlined />} onClick={handleExportExcel} key={'export_reconciliation_item'}>
          {translate('reconciliations.buttons.export')}
        </Button>,
      ]}
    >
      <Card
        title={translate('reconciliations.fields.reconciliationId')}
        loading={isLoading}
        extra={
          <Typography.Text strong style={{ color: 'red' }}>
            #{id}
          </Typography.Text>
        }
      >
        <Row>
          <Col span={12}>
            <Space direction={'vertical'}>
              <CardContent title={translate('reconciliations.fields.customer')} subtitle={data?.data?.customer?.username} />
              <CardContent title={translate('reconciliations.fields.sale')} subtitle={data?.data?.customer?.sale?.username} />
              <CardContent title={translate('reconciliations.fields.note')} subtitle={data?.data?.note} />
              <CardContent title={translate('reconciliations.fields.status')} subtitle={data?.data?.status} />
            </Space>
          </Col>
          <Col span={12}>
            <Space direction={'vertical'}>
              <CardContent
                title={translate('reconciliations.fields.totalCustomerRefund')}
                subtitle={
                  <Typography.Paragraph strong style={{ color: 'red' }}>
                    {StringUtils.convertNumberToCurrency(data?.data?.total_customer_refund || 0)} / {data?.data?.reconciliation_orders.length} đơn
                  </Typography.Paragraph>
                }
              />
              {canAccess?.can && (
                <CardContent
                  title={translate('reconciliations.fields.totalSystemRevenue')}
                  subtitle={
                    <Typography.Paragraph strong style={{ color: 'red' }}>
                      {StringUtils.convertNumberToCurrency(data?.data?.total_system_revenue || 0)}
                    </Typography.Paragraph>
                  }
                />
              )}
            </Space>
          </Col>
        </Row>
      </Card>
      <Divider />
      <Table columns={columns} dataSource={data?.data?.reconciliation_orders} rowKey="uid" loading={isLoading} bordered={true} size={'small'} pagination={false} scroll={{ x: 1500 }}></Table>
    </Show>
  );
};
