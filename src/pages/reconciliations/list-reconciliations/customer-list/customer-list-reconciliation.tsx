import { DateField, useTable, List, ShowButton } from '@refinedev/antd';
import { HttpError, IResourceComponentsProps } from '@refinedev/core';
import { Card, Space, Table, Tag, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';

import { IReconciliation } from '../../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../../utils';

export const CustomerListReconciliation: React.FC<IResourceComponentsProps> = () => {
  const {
    tableProps,
    tableQueryResult: { isLoading },
  } = useTable<IReconciliation, HttpError>({
    resource: APIEndPoint.RECONCILIATIONS,
    syncWithLocation: false,
  });

  const columns = useMemo<(ColumnGroupType<IReconciliation> | ColumnType<IReconciliation>)[]>(() => {
    return [
      {
        dataIndex: 'id',
        title: 'Phiên đối soát',
      },
      {
        dataIndex: ['reconciliation_orders', 'length'],
        title: 'Số đơn',
      },
      {
        dataIndex: 'status',
        render: value => {
          return <Tag color={StringUtils.getStatusColor(value)}>{StringUtils.getStatusReconciliationTitle(value)}</Tag>;
        },
        title: 'Trạng thái',
      },
      {
        align: 'center',
        dataIndex: 'total_customer_refund',
        render: value => {
          return (
            <Typography.Paragraph strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Typography.Paragraph>
          );
        },
        title: 'Tổng hoàn khách',
      },
      {
        dataIndex: 'updatedAt',
        render: value => value && <DateField value={value} format={'HH:mm, dddd, DD/MM/YYYY'} lang={'vi'} locales={'vi'} />,
        title: 'Ngày đối soát',
      },
      {
        render: (_, record) => (
          <Space>
            <ShowButton hideText size="small" recordItemId={record.id} />
          </Space>
        ),
        title: 'Hành động',
      },
    ];
  }, []);

  return (
    <List title={'Danh sách đối soát'} headerButtons={[]}>
      <Card>
        <Table
          {...tableProps}
          rowKey="uid"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          columns={columns}
          loading={isLoading}
          scroll={{ x: 1500 }}
        />
      </Card>
    </List>
  );
};
