import { ExclamationOutlined } from '@ant-design/icons';
import { DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { HttpError, IResourceComponentsProps, useTranslate } from '@refinedev/core';
import { Card, Table, Space, Tag, TableColumnsType } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { IPriceSheet, IUser } from 'interfaces/types';
import React, { useMemo } from 'react';
import { APIEndPoint } from 'utils';

import { GHNIcon, GHTKIcon, NinjavanIcon } from '../../components';
import { ISearchCustomerPrice, SearchForm } from './components/SearchForm';
import { onCustomerPricesSearch } from './utils/customer-prices';

interface IUserPriceSheetByCustomerResponse {
  customer: IUser;
  priceSheets: [IPriceSheet];
}

export const CustomerPricesList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { isLoading, refetch },
  } = useTable<IUserPriceSheetByCustomerResponse, HttpError, ISearchCustomerPrice>({
    filters: {
      defaultBehavior: 'replace',
      mode: 'server',
    },
    onSearch: onCustomerPricesSearch,
    resource: APIEndPoint.USER_PRICE_SHEETS_BY_CUSTOMER,
  });

  const getIconCarrier = (type: string): React.ReactNode => {
    switch (type) {
      case 'GHN':
        return <GHNIcon size={24} />;
      case 'GHTK':
        return <GHTKIcon size={24} />;
      case 'NINJAVAN':
        return <NinjavanIcon size={24} />;
      default:
        return <ExclamationOutlined />;
    }
  };

  // Define columns to show for customer
  const columns = useMemo<(ColumnGroupType<IUserPriceSheetByCustomerResponse> | ColumnType<IUserPriceSheetByCustomerResponse>)[]>(() => {
    return [
      Table.EXPAND_COLUMN,
      {
        align: 'center',
        render: (value, record, index) => {
          return index + 1;
        },
        title: 'STT',
        width: '5%',
      },
      {
        dataIndex: ['customer', 'username'],
        title: translate('priceSheets.labels.customer'),
        width: '20%',
      },
      {
        dataIndex: ['customer', 'email'],
        title: 'Email',
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: ['priceSheets', 'length'],
        title: translate('priceSheets.labels.numOfPriceSheet'),
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: ['priceSheets'],
        render: (value, record, index) => {
          const icons = value.map((item: IPriceSheet) => {
            return getIconCarrier(item.carrier.name);
          });
          return <Space direction={'horizontal'}>{icons}</Space>;
        },
        title: translate('priceSheets.labels.carrier'),
      },
    ];
  }, []);

  const expandedRowRender = (record: IUserPriceSheetByCustomerResponse, index: number, indent: number, expanded: boolean) => {
    const columns: TableColumnsType<IPriceSheet> = [
      {
        dataIndex: 'name',
        key: index,
        title: translate('priceSheets.labels.namePriceSheet'),
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: ['carrier', 'name'],
        title: translate('priceSheets.labels.carrier'),
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: 'default',
        render: value => (value ? <Tag color={'success'}>Mặc định</Tag> : <Tag color={'default'}>Điều chỉnh</Tag>),
        title: 'Default',
        width: '20%',
      },
      {
        align: 'center',
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <DeleteButton
              hideText
              disabled={false}
              size="small"
              recordItemId={record.id}
              resource={APIEndPoint.USER_PRICE_SHEETS}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </Space>
        ),
        title: translate('priceSheets.labels.action'),
      },
    ];
    return <Table rowKey="id" bordered columns={columns} showHeader={false} dataSource={record.priceSheets} pagination={false} />;
  };

  return (
    <List title={translate('priceSheets.titles.listCustomerPrice')}>
      <SearchForm searchFormProps={searchFormProps} />
      <Card title={'Kết quả tìm kiếm'}>
        <Table
          {...tableProps}
          loading={isLoading}
          rowKey={record => record.customer.username}
          bordered
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          columns={columns}
          expandable={{
            expandedRowRender,
          }}
        />
      </Card>
    </List>
  );
};
