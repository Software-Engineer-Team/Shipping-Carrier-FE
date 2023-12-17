import { useApiUrl, useCustom } from '@refinedev/core';
import { Card, Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';

import { USER_ID_KEY } from '../../../../constants';
import { IBankAccount } from '../../../../interfaces/types';
import { APIEndPoint } from '../../../../utils';
interface IBankResponse {
  data: IBankAccount[];
}
export const Bank = () => {
  const apiUrl = useApiUrl();
  const { data, isLoading } = useCustom<IBankResponse>({
    config: {
      query: {
        user_id: localStorage.getItem(USER_ID_KEY),
      },
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.BANK_ACCOUNTS}`,
  });

  const columns = useMemo<(ColumnGroupType<IBankAccount> | ColumnType<IBankAccount>)[]>(() => {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
      },
      {
        dataIndex: ['bank', 'name'],
        title: 'Tên ngân hàng',
      },
      {
        dataIndex: 'bank_account_number',
        title: 'Số tài khoản',
      },
      {
        dataIndex: 'account_holder_name',
        title: 'Tên chủ tài khoản',
      },
    ];
  }, []);

  return (
    <Card title={'Tài khoản ngân hàng'}>
      <Table dataSource={data?.data?.data} columns={columns} loading={isLoading} />
    </Card>
  );
};
