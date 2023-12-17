import { DeleteButton, EditButton, List } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom } from '@refinedev/core';
import { Space, Table, Tag } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';

import { USER_ID_KEY } from '../../constants';
import { IAddress } from '../../interfaces/types';
import { APIEndPoint } from '../../utils';
export interface AddressResponse {
  data: IAddress[];
}
export const AddressesList: React.FC<IResourceComponentsProps> = () => {
  const apiUrl = useApiUrl();
  const { data, isLoading, refetch } = useCustom<AddressResponse>({
    config: {
      query: {
        user_id: localStorage.getItem(USER_ID_KEY),
      },
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.ADDRESSES}`,
  });

  const columns = useMemo<(ColumnGroupType<IAddress> | ColumnType<IAddress>)[]>(() => {
    return [
      {
        dataIndex: 'from_name',
        title: 'Tên người gửi',
        width: '12.5%',
      },
      {
        dataIndex: 'from_phone_number',
        title: 'Số điện thoại',
        width: '12.5%',
      },
      {
        dataIndex: 'from_province',
        title: 'Tỉnh gửi',
        width: '12.5%',
      },
      {
        dataIndex: 'from_district',
        title: 'Quận/Huyện',
        width: '12.5%',
      },
      {
        dataIndex: 'from_ward',
        title: 'Phường/Xã',
        width: '12.5%',
      },
      {
        dataIndex: 'from_address',
        title: 'Địa chỉ',
        width: '12.5%',
      },
      {
        dataIndex: 'default',
        render: (value, record, index) => {
          if (value) {
            return <Tag color="success">Mặc định</Tag>;
          }
        },
        title: 'Mặc định',
        width: '12.5%',
      },
      {
        render: (_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              resource={APIEndPoint.ADDRESSES}
              disabled={record.default}
              onSuccess={async () => {
                await refetch();
              }}
            />
          </Space>
        ),
        title: 'Hành động',
        width: '12.5%',
      },
    ];
  }, []);

  return (
    <List title={'Danh  sách kho hàng'}>
      <Table style={{ width: '100%' }} dataSource={data?.data?.data} columns={columns} loading={isLoading} key={'id'} scroll={{ x: 1500 }}></Table>
    </List>
  );
};
