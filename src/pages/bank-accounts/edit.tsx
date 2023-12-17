import { Edit, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useNavigation, useParsed } from '@refinedev/core';
import { Form, Input, Select, Switch } from 'antd';
import React from 'react';

import { IBank } from '../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../utils';

export const BankAccountsEdit: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();
  const { id } = useParsed();

  const { form, formProps, onFinish, saveButtonProps } = useForm({
    action: 'edit',
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi cập nhật thông tin ngân hàng',
        type: 'error',
      };
    },
    id,
    resource: APIEndPoint.BANK_ACCOUNTS,
    successNotification: (data, values, resource) => {
      goBack();
      return {
        description: 'Thành công',
        message: 'Cập nhật thông tin ngân hàng thành công',
        type: 'success',
      };
    },
  });

  const { queryResult } = useSelect<IBank>({
    resource: APIEndPoint.BANKS,
  });

  const onSubmit = async (values: any) => {
    values['user'] = form.getFieldValue(['user', 'id']);
    values['bank'] = form.getFieldValue(['bank', 'name']);
    await onFinish(values);
  };

  return (
    <Edit title={'Chỉnh sửa tài khoản ngân hàng'} saveButtonProps={saveButtonProps} headerButtons={[]}>
      <Form {...formProps} layout="vertical" onFinish={onSubmit}>
        <Form.Item label={'Khách hàng'} name={['user', 'username']}>
          <Input disabled></Input>
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
          name={['bank', 'name']}
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
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
