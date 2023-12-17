import { DateField, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { IResourceComponentsProps, GetListResponse, HttpError } from '@refinedev/core';
import { Space, Table } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { APIEndPoint } from 'utils';

import { IUser } from '../../interfaces/types';

export const UsersList: React.FC<IResourceComponentsProps<GetListResponse<{}>>> = () => {
  const {
    tableProps,
    tableQueryResult: { refetch },
  } = useTable<IUser, HttpError>({
    initialFilter: [
      {
        field: 'role.type',
        operator: 'ne',
        value: 'customer',
      },
    ],
    meta: {
      populate: ['role'],
    },
    resource: APIEndPoint.USERS,
  });
  const columns = useMemo<(ColumnGroupType<IUser> | ColumnType<IUser>)[]>(() => {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
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
    <List title={'Danh sách user'}>
      <Table
        {...tableProps}
        rowKey="id"
        columns={columns}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      ></Table>
    </List>
  );
};
