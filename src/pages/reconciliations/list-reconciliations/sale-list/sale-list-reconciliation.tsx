import { ExportOutlined } from '@ant-design/icons';
import { DateField, useTable, List, ShowButton } from '@refinedev/antd';
import { HttpError, IResourceComponentsProps, useTranslate } from '@refinedev/core';
import { Button, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { IReconciliation } from '../../../../interfaces/types';
import { APIEndPoint, exportToExcel, StringUtils } from '../../../../utils';
import { ISaleSearchReconciliation, SaleSearchForm } from '../../components/SaleSearchForm';
import { columnsExportReconciliation, normalizeExportData, onSaleSearchReconciliations } from '../../utils/reconciliations';

export const SaleListReconciliation: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { data, isLoading, isRefetching },
  } = useTable<IReconciliation, HttpError, ISaleSearchReconciliation>({
    filters: {
      defaultBehavior: 'replace',
      initial: [
        {
          field: 'status',
          operator: 'eq',
          value: 'completed',
        },
      ],
      mode: 'server',
    },
    onSearch: onSaleSearchReconciliations,
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
        dataIndex: ['customer', 'username'],
        title: 'Shop',
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

  const handleExportExcel = () => {
    if (data?.data) {
      exportToExcel(normalizeExportData(data?.data), columnsExportReconciliation, `BSS_Danh sách đối soát_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  };

  return (
    <List
      title={'Danh sách đối soát'}
      headerButtons={[
        <Tooltip title={translate('orders.titles.selectOrderToExport')} key={'export_order'}>
          <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
            Xuất file
          </Button>
        </Tooltip>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SaleSearchForm searchFormProps={searchFormProps}></SaleSearchForm>
        </Col>
        <Col span={24}>
          <Card>
            <Table
              {...tableProps}
              rowKey="uid"
              pagination={{
                ...tableProps.pagination,
                showSizeChanger: true,
              }}
              columns={columns}
              loading={isLoading || isRefetching}
              scroll={{ x: 1500 }}
            />
          </Card>
        </Col>
      </Row>
    </List>
  );
};
