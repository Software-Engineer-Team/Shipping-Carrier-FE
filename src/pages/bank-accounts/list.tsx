import { ExportOutlined } from '@ant-design/icons';
import { DateField, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { HttpError, IResourceComponentsProps } from '@refinedev/core';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

import { IBankAccount } from '../../interfaces/types';
import { APIEndPoint, columnsExportBank, exportToExcel } from '../../utils';
import { ISearchBank, SearchForm } from './components/SearchForm';
import { onBankSearch } from './utils/banks';

export const BankAccountsList: React.FC<IResourceComponentsProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    searchFormProps,
    tableProps,
    tableQueryResult: { data: dataBanks, refetch },
  } = useTable<IBankAccount, HttpError, ISearchBank>({
    filters: {
      defaultBehavior: 'replace',
      mode: 'server',
    },
    onSearch: onBankSearch,
    resource: APIEndPoint.BANK_ACCOUNTS,
    syncWithLocation: false,
  });
  // Handle on select multiple row
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };
  const handleExportExcel = () => {
    const bankFiltered = dataBanks?.data.filter(item => selectedRowKeys.includes(item.id));
    if (bankFiltered) {
      exportToExcel(bankFiltered, columnsExportBank, `BSS_Danh sách tài khoản ngân hàng_${dayjs().format('DDMMYYYY_HHmmss')}`);
    }
  };
  const columns = useMemo<(ColumnGroupType<IBankAccount> | ColumnType<IBankAccount>)[]>(() => {
    return [
      {
        align: 'center',
        dataIndex: ['user', 'id'],
        title: 'Mã khách hàng',
      },
      {
        dataIndex: ['user', 'username'],
        title: 'Username',
      },
      {
        dataIndex: ['user', 'sale', 'username'],
        title: 'Sale',
      },
      {
        dataIndex: 'bank_account_number',
        title: 'Số tài khoản',
      },
      {
        dataIndex: ['bank', 'name'],
        title: 'Tên ngân hàng',
      },
      {
        dataIndex: 'account_holder_name',
        title: 'Tên người thụ hưởng',
      },
      {
        align: 'center',
        dataIndex: 'createdAt',
        render: value => {
          return value && <DateField value={value} format={'L'} locales={'vi'} />;
        },
        title: 'Ngày tạo',
      },
      {
        align: 'center',
        dataIndex: 'updatedAt',
        render: value => {
          return value && <DateField value={value} format={'L'} locales={'vi'} />;
        },
        title: 'Ngày cập nhật',
      },
      {
        align: 'center',
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </Space>
        ),
        title: 'Hành động',
      },
    ];
  }, []);
  return (
    <List title={'Danh sách tài khoản ngân hàng'}>
      <SearchForm searchFormProps={searchFormProps} />
      <Card
        style={{ marginTop: 16 }}
        extra={
          <>
            <Tooltip title={'Xuất excel'}>
              <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
                Xuất file
              </Button>
            </Tooltip>
          </>
        }
      >
        <Table
          {...tableProps}
          columns={columns}
          rowSelection={rowSelection}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
        ></Table>
      </Card>
    </List>
  );
};
