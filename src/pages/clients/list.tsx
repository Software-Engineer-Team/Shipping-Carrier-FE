import { ExportOutlined } from '@ant-design/icons';
import { DateField, EditButton, List, useTable } from '@refinedev/antd';
import { HttpError, IResourceComponentsProps, useCan } from '@refinedev/core';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

import { IUser } from '../../interfaces/types';
import { APIEndPoint, columnsExportCustomer, exportToExcel } from '../../utils';
import { ISearchCustomer, SearchForm } from './components/SearchForm';
import { onCustomerSearch } from './utils/clients';

export const ClientList: React.FC<IResourceComponentsProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data: canAccess } = useCan({
    action: 'field',
    params: { field: 'export' },
    resource: 'client',
  });
  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { data: dataClients },
  } = useTable<IUser, HttpError, ISearchCustomer>({
    filters: {
      defaultBehavior: 'replace',
      mode: 'server',
    },
    initialFilter: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    meta: {
      populate: ['role', 'sale'],
    },
    onSearch: onCustomerSearch,
    resource: APIEndPoint.USERS,
    syncWithLocation: false,
  });
  // ======================== Extra actions ========================
  // Handle on select multiple row
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };
  // Handle export excel
  const handleExportExcel = () => {
    const clientFiltered = dataClients?.data.filter(item => selectedRowKeys.includes(item.id));
    if (clientFiltered) {
      exportToExcel(clientFiltered, columnsExportCustomer, `BSS_Danh sách khách hàng_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  };
  const columns = useMemo<(ColumnGroupType<IUser> | ColumnType<IUser>)[]>(() => {
    return [
      {
        align: 'center',
        render: (_, __, index) => index + 1,
        title: 'STT',
      },
      {
        align: 'center',
        dataIndex: 'id',
        title: 'ID Khách hàng',
      },
      {
        dataIndex: 'username',
        title: 'Username',
      },
      {
        dataIndex: 'email',
        title: 'Email',
      },
      {
        align: 'center',
        dataIndex: 'phone_number',
        title: 'Số điện thoại',
      },
      {
        align: 'center',
        dataIndex: ['role', 'name'],
        title: 'Role',
      },
      {
        align: 'center',
        dataIndex: ['sale', 'username'],
        title: 'Sale',
      },
      {
        align: 'center',
        dataIndex: 'createdAt',
        render: value => {
          return value && <DateField value={value} format={'L'} />;
        },
        title: 'Ngày tạo',
      },
      {
        align: 'center',
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
          </Space>
        ),
        title: 'Hành động',
      },
    ];
  }, []);
  return (
    <List title={'Quản lý khách hàng'}>
      <SearchForm searchFormProps={searchFormProps} />
      <Card
        title={'Danh sách khách hàng'}
        style={{ marginTop: 16 }}
        extra={
          <>
            {canAccess?.can && (
              <Tooltip title={'Xuất excel'}>
                <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
                  Xuất file
                </Button>
              </Tooltip>
            )}
          </>
        }
      >
        <Table
          {...tableProps}
          rowKey="id"
          columns={columns}
          rowSelection={rowSelection}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
        ></Table>
      </Card>
    </List>
  );
};
