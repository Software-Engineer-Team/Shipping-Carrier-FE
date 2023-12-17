import { ExclamationOutlined } from '@ant-design/icons';
import { DateField, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { IResourceComponentsProps, GetListResponse, HttpError, useTranslate } from '@refinedev/core';
import { Card, Space, Spin, Table, Tag } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';
import { APIEndPoint } from 'utils';

import { GHNIcon, GHTKIcon, NinjavanIcon } from '../../components';
import { IPriceSheet } from '../../interfaces/types';

export const PriceSheetsList: React.FC<IResourceComponentsProps<GetListResponse<{}>>> = () => {
  const translate = useTranslate();
  const {
    tableProps,
    tableQueryResult: { isLoading, refetch },
  } = useTable<IPriceSheet, HttpError>({
    meta: {
      populate: {
        carrier: true,
      },
    },
    resource: APIEndPoint.PRICE_SHEETS,
  });

  const getIconCarrier = (type: string): React.ReactNode => {
    switch (type) {
      case 'GHN':
        return <GHNIcon size={40} />;
      case 'GHTK':
        return <GHTKIcon size={40} />;
      case 'NINJAVAN':
        return <NinjavanIcon size={40} />;
      default:
        return <ExclamationOutlined />;
    }
  };

  const columns = useMemo<(ColumnGroupType<IPriceSheet> | ColumnType<IPriceSheet>)[]>(() => {
    return [
      {
        dataIndex: 'name',
        title: translate('priceSheets.labels.namePriceSheet'),
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: ['carrier', 'name'],
        render: (value, record, index) => {
          return getIconCarrier(value);
        },
        title: translate('priceSheets.labels.carrier'),
        width: '10%',
      },
      {
        align: 'center',
        dataIndex: 'default',
        render: value => (value ? <Tag color={'processing'}>Default</Tag> : null),
        title: 'Default',
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: 'createdAt',
        render: value => <DateField value={value} locales={'vi'} lang={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />,
        title: translate('priceSheets.labels.createdAt'),
        width: '20%',
      },
      {
        align: 'center',
        dataIndex: 'updatedAt',
        render: value => <DateField value={value} locales={'vi'} lang={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />,
        title: translate('priceSheets.labels.updatedAt'),
        width: '20%',
      },
      {
        align: 'center',
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <DeleteButton
              hideText
              resource={APIEndPoint.PRICE_SHEETS}
              size="small"
              recordItemId={record.id}
              disabled={record.default}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </Space>
        ),
        title: translate('priceSheets.labels.action'),
      },
    ];
  }, []);

  return (
    <List title={translate('priceSheets.titles.list')}>
      <Card>
        {isLoading ? (
          <Spin />
        ) : (
          <Table
            {...tableProps}
            rowKey="id"
            pagination={{
              ...tableProps.pagination,
              showSizeChanger: true,
            }}
            columns={columns}
          />
        )}
      </Card>
    </List>
  );
};
