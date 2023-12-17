import { Create, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation } from '@refinedev/core';
import { Form, Input, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

import { IBank, IUser } from '../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../utils';

export const BankAccountsCreate: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();
  const [customerOptions, setCustomerOptions] = useState<IUser[]>([]);

  const { form, onFinish, saveButtonProps } = useForm({
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo tài khoản ngân hàng',
        type: 'error',
      };
    },
    resource: APIEndPoint.BANK_ACCOUNTS,
    successNotification: (data, values, resource) => {
      goBack();
      return {
        description: 'Thành công',
        message: 'Tài khoản ngân hàng được tạo thành công',
        type: 'success',
      };
    },
  });
  const { queryResult: queryCustomer } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'eq',
        value: 'customer',
      },
    ],
    resource: APIEndPoint.USERS,
  });

  useEffect(() => {
    if (queryCustomer?.data?.data) {
      setCustomerOptions(
        queryCustomer?.data?.data?.filter(user => {
          return user?.role?.type === 'customer';
        }),
      );
    }
  }, [queryCustomer?.data?.data]);

  const { queryResult } = useSelect<IBank>({
    resource: APIEndPoint.BANKS,
  });

  return (
    <Create title={'Tạo tài khoản ngân hàng'} saveButtonProps={saveButtonProps}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={'Khách hàng'}
          name="user"
          rules={[
            {
              message: 'Vui lòng chọn khách hàng',
              required: true,
            },
          ]}
        >
          <Select
            options={customerOptions.map(customer => {
              return {
                label: customer.username,
                value: customer.id,
              };
            })}
            onClear={() => {
              form?.setFieldValue('customer', null);
            }}
            showSearch={true}
            filterOption={(input, option) =>
              StringUtils.removeAccents(option?.label.toLowerCase() ?? '')
                .trim()
                .toLowerCase()
                .includes(StringUtils.removeAccents(input).toLowerCase().trim())
            }
            allowClear
            placeholder={'Chọn khách hàng'}
          />
        </Form.Item>
        <Form.Item
          label="Số tài khoản ngân hàng"
          name="bank_account_number"
          rules={[
            {
              message: 'Vui lòng nhập tài khoản ngân hàng',
              required: true,
            },
          ]}
        >
          <Input allowClear placeholder={'Nhập tài khoản ngân hàng'} />
        </Form.Item>
        <Form.Item
          label="Ngân hàng"
          name="bank"
          rules={[
            {
              message: 'Vui lòng chọn ngân hàng',
              required: true,
            },
          ]}
        >
          <Select
            options={queryResult?.data?.data?.map(bank => {
              return {
                label: bank.name,
                value: bank.name,
              };
            })}
            placeholder={'Chọn ngân hàng'}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              StringUtils.removeAccents(option?.label?.toString().toLowerCase() ?? '')
                .trim()
                .toLowerCase()
                .includes(StringUtils.removeAccents(input).toLowerCase().trim())
            }
          />
        </Form.Item>
        <Form.Item
          label="Tên chủ tài khoản"
          name="account_holder_name"
          rules={[
            {
              message: 'Vui lòng nhập tên chủ tài khoản',
              required: true,
            },
            {
              message: 'Tên chủ tài khoản không được chứa số và ký tự đặc biệt',
              pattern: /^[a-zA-Z\s]*$/,
            },
          ]}
        >
          <Input
            allowClear
            placeholder={'Nhập tên chủ tài khoản'}
            onInput={e => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />
        </Form.Item>
        <Form.Item name={'default'} label={'Mặc định'} valuePropName={'checked'}>
          <Switch></Switch>
        </Form.Item>
      </Form>
    </Create>
  );
};
