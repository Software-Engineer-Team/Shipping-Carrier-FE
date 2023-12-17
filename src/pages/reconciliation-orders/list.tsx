import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { CreateButton, DateField, List } from '@refinedev/antd';
import { IResourceComponentsProps, useTranslate } from '@refinedev/core';
import { Button, Card, DatePicker, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { rangePresets, StringUtils } from '../../utils';
import { ReconciliationOrdersGroupByCustomer, useReconciliationOrdersList } from './list.hook';

const { RangePicker } = DatePicker;
export const ReconciliationOrderList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { dataSource, handleOnChangeDatePicker, handleOnCreateReconciliation, isLoading, isRefetching, isSelectedRowValid, rowSelection } = useReconciliationOrdersList();

  const columns = useMemo<(ColumnGroupType<ReconciliationOrdersGroupByCustomer> | ColumnType<ReconciliationOrdersGroupByCustomer>)[]>(() => {
    return [
      {
        dataIndex: ['customer', 'username'],
        render: (value: string, record, index) => {
          return value && <Typography.Text strong>{value.toUpperCase()}</Typography.Text>;
        },
        title: translate('reconciliationOrders.fields.customer'),
        width: '10%',
      },
      {
        children: [
          {
            align: 'center',
            dataIndex: 'id',
            title: 'ID',
          },
          {
            dataIndex: 'tracking_id',
            title: translate('reconciliationOrders.fields.trackingId'),
          },
          {
            align: 'center',
            dataIndex: 'start_date',
            render: (value, record, index) => {
              return value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />;
            },
            title: translate('reconciliationOrders.fields.startDate'),
          },
          {
            align: 'center',
            dataIndex: 'end_date',
            render: (value, record, index) => {
              return value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />;
            },
            title: translate('reconciliationOrders.fields.endDate'),
          },
          {
            align: 'center',
            dataIndex: 'status',
            title: translate('reconciliationOrders.fields.statusOrder'),
          },
          {
            align: 'center',
            dataIndex: 'weight',
            title: translate('reconciliationOrders.fields.weight'),
          },
          {
            align: 'center',
            dataIndex: 'partner_cash_on_delivery',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.COD'),
          },
          {
            align: 'center',
            dataIndex: 'partner_shipment_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.shipmentFee'),
          },
          {
            align: 'center',
            dataIndex: 'partner_return_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.returnFee'),
          },
          {
            align: 'center',
            dataIndex: 'partner_insurance_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.insuranceFee'),
          },
          {
            align: 'center',
            dataIndex: 'partner_change_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.changeFee'),
          },
          {
            align: 'center',
            dataIndex: 'partner_other_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.otherFee'),
          },
          {
            align: 'center',
            dataIndex: 'total_shipment_fee',
            render: value => value && StringUtils.convertNumberToCurrency(value),
            title: translate('reconciliationOrders.fields.totalFee'),
          },
          {
            align: 'center',
            dataIndex: 'createdAt',
            render: (value, record, index) => {
              return value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />;
            },
            title: translate('reconciliationOrders.fields.createdAt'),
          },
        ],
        title: translate('reconciliationOrders.title.list'),
      },
    ];
  }, [translate]);

  return (
    <List
      title={'Danh sách đơn đã nhập'}
      headerButtons={[
        <Tooltip title={translate('reconciliationOrders.tooltips.upload')} key={'upload_reconciliation_order'}>
          <CreateButton icon={<UploadOutlined />}>{translate('reconciliationOrders.buttons.upload')}</CreateButton>
        </Tooltip>,
        <Tooltip title={translate('reconciliationOrders.tooltips.create')} key={'create_reconciliation'}>
          <Button icon={<PlusOutlined />} onClick={handleOnCreateReconciliation} disabled={!isSelectedRowValid}>
            {translate('reconciliationOrders.buttons.create')}
          </Button>
        </Tooltip>,
      ]}
    >
      <Card style={{ marginBottom: 10 }}>
        <Space direction={'horizontal'} align={'center'}>
          <Typography.Text strong>{translate('reconciliationOrders.fields.createdAt')}</Typography.Text>
          <Space size={[16, 16]} wrap>
            <RangePicker
              style={{ width: 200 }}
              presets={rangePresets}
              format={'DD-MM-YYYY'}
              placeholder={[translate('orders.placeholders.fromDate'), translate('orders.placeholders.toDate')]}
              defaultValue={[dayjs().startOf('D'), dayjs().endOf('D')]}
              onChange={async createdAt => {
                await handleOnChangeDatePicker(createdAt as [dayjs.Dayjs, dayjs.Dayjs]);
              }}
            />
          </Space>
        </Space>
      </Card>

      <Table
        pagination={{
          showSizeChanger: true,
        }}
        loading={isLoading || isRefetching}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        size={'small'}
      />
    </List>
  );
};
