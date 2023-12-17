import { DeleteOutlined, PhoneOutlined, PlusOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Create, SaveButton, useForm, useSelect } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom, useNavigation, useTranslate } from '@refinedev/core';
import { Alert, Button, Divider, Form, FormInstance, Input, Modal, Select, Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { APIEndPoint, StringUtils } from 'utils';

import { SelectAddress } from '../../components';
import { IBank, IRole, IUser } from '../../interfaces/types';

interface IRoleResponse {
  roles: IRole[];
}
interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
}

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, open }: { form: FormInstance; open: boolean }) => {
  const prevOpenRef = useRef<boolean>();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};
const ModalAddressForm: React.FC<ModalFormProps> = ({ onCancel, open }) => {
  const [form] = Form.useForm();
  const translate = useTranslate();

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    form.setFieldValue('default', true);
    form.submit();
  };

  return (
    <Modal title="Tạo địa chỉ mặc định" open={open} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="addressDefaultForm">
        <Form.Item
          label={translate('orders.labels.fromName')}
          name="from_name"
          rules={[
            {
              message: 'Vui lòng nhập tên người gửi',
              required: true,
            },
          ]}
        >
          <Input allowClear prefix={<UserOutlined />} placeholder={translate('orders.placeholders.fromName')} />
        </Form.Item>
        <Form.Item
          label={translate('orders.labels.fromPhoneNumber')}
          name="from_phone_number"
          rules={[
            {
              message: 'Vui lòng nhập đúng số điện thoại',
              pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              required: true,
            },
          ]}
        >
          <Input allowClear prefix={<PhoneOutlined />} placeholder={translate('orders.placeholders.fromPhoneNumber')} />
        </Form.Item>
        <SelectAddress
          nameProvince="from_province"
          nameDistrict="from_district"
          nameWard="from_ward"
          nameAddress="from_address"
          nameProvinceCode="from_province_code"
          nameDistrictCode="from_district_code"
          nameWardCode="from_ward_code"
          labelProvince="form.label.province"
          labelDistrict="form.label.district"
          labelAddress="form.label.address"
          labelWard="form.label.ward"
        />
        <Form.Item name={'default'} hidden />
      </Form>
    </Modal>
  );
};

const ModalBankForm: React.FC<ModalFormProps> = ({ onCancel, open }) => {
  const [form] = Form.useForm();
  const { queryResult } = useSelect<IBank>({
    resource: APIEndPoint.BANKS,
  });

  useResetFormOnCloseModal({
    form,
    open,
  });
  const onOk = () => {
    form.setFieldValue('default', true);
    form.submit();
  };

  return (
    <Modal title="Tạo tài khoản ngân hàng mặc định" open={open} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="bankDefaultForm">
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
        <Form.Item name={'default'} hidden />
      </Form>
    </Modal>
  );
};

export const ClientCreate: React.FC<IResourceComponentsProps> = () => {
  const { goBack } = useNavigation();

  const { form, formProps, onFinish, saveButtonProps } = useForm({
    errorNotification: (error, values, resource) => {
      return {
        description: 'Lỗi',
        message: error?.message || 'Lỗi khi tạo khách hàng',
        type: 'error',
      };
    },
    resource: APIEndPoint.USERS,
    successNotification: (data, values, resource) => {
      goBack();
      return {
        description: 'Thành công',
        message: 'Khách hàng được tạo thành công',
        type: 'success',
      };
    },
  });

  const apiUrl = useApiUrl();
  const { data: roleData } = useCustom<IRoleResponse>({
    method: 'get',
    url: `${apiUrl}/users-permissions/roles`,
  });
  const { selectProps } = useSelect<IUser>({
    filters: [
      {
        field: 'role.type',
        operator: 'in',
        value: ['admin', 'sale'],
      },
    ],
    optionLabel: 'username',
    optionValue: 'id',
    resource: APIEndPoint.USERS,
  });
  const [customerRole, setCustomerRole] = useState<IRole>();
  useEffect(() => {
    if (roleData) {
      const customer = roleData?.data?.roles?.find(item => item.type === 'customer');
      setCustomerRole(customer);
    }
  }, [roleData]);

  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [openBankForm, setOpenBankForm] = useState(false);

  const onRemoveAddress = () => {
    form.setFieldValue('address', null);
  };
  const onRemoveBank = () => {
    form.setFieldValue('bank', null);
  };

  const handleSubmit = async (values: any) => {
    values['role'] = customerRole?.id;
    await onFinish(values);
  };

  return (
    <Create title={'Tạo khách hàng'} footerButtons={[<SaveButton {...saveButtonProps} key={'save_button'} />]}>
      <Form.Provider
        onFormFinish={(name, { forms, values }) => {
          if (name === 'addressDefaultForm') {
            const { basicForm } = forms;
            basicForm.setFieldsValue({ address: values });
            setOpenAddressForm(false);
          }
          if (name === 'bankDefaultForm') {
            const { basicForm } = forms;
            basicForm.setFieldsValue({ bank: values });
            setOpenBankForm(false);
          }
        }}
      >
        <Form name={'basicForm'} form={form} {...formProps} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} labelAlign="left" labelWrap onFinish={handleSubmit}>
          <Divider orientation={'left'} orientationMargin="0">
            Thông tin tài khoản
          </Divider>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                message: 'Vui lòng nhập username',
                required: true,
              },
            ]}
          >
            <Input placeholder={'Nhập username'} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                message: 'Vui lòng nhập email',
                required: true,
              },
            ]}
          >
            <Input placeholder={'Nhập địa chỉ email'} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                message: 'Vui lòng nhập password',
                required: true,
              },
              {
                message: 'Mật khẩu không được chứa khoảng trắng',
                pattern: /^\S+$/,
              },
            ]}
          >
            <Input.Password placeholder={'Nhập password'} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
            rules={[
              {
                message: 'Vui lòng nhập đúng số điện thoại',
                pattern: /^(\+)?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                required: true,
              },
            ]}
          >
            <Input placeholder={'Nhập số điện thoại'} />
          </Form.Item>
          <Form.Item
            name={'sale'}
            label={'Sale'}
            rules={[
              {
                message: 'Vui lòng chọn sale',
                required: true,
              },
            ]}
          >
            <Select {...selectProps} placeholder={'Chọn sale'}></Select>
          </Form.Item>
          <Form.Item name={'address'} hidden />
          <Form.Item
            name={'bank'}
            hidden
            rules={[
              {
                message: 'Vui lòng thêm thông tin ngân hàng',
                required: true,
              },
            ]}
          />
          <Form.Item label={'Địa chỉ mặc định'} shouldUpdate={(prevValues, curValues) => prevValues.address !== curValues.address}>
            {({ getFieldValue }) => {
              const address = getFieldValue('address');
              return address ? (
                <Space direction={'horizontal'}>
                  <Typography.Text>
                    {[address?.from_name, address?.from_phone_number, address?.from_address, address?.from_ward, address?.from_district, address?.from_province].join(', ')}
                  </Typography.Text>
                  <Button icon={<DeleteOutlined />} onClick={onRemoveAddress}></Button>
                </Space>
              ) : (
                <Typography.Text className="ant-form-text" type="secondary">
                  ( <SmileOutlined /> Chưa có địa chỉ. )
                </Typography.Text>
              );
            }}
          </Form.Item>

          <Form.Item label={'Ngân hàng mặc định'} shouldUpdate={(prevValues, curValues) => prevValues.bank !== curValues.bank} required>
            {({ getFieldValue }) => {
              const bank = getFieldValue('bank');
              return bank ? (
                <Space direction={'horizontal'}>
                  <Typography.Text>{[bank?.bank, bank?.bank_account_number, bank?.account_holder_name].join('| ')}</Typography.Text>
                  <Button icon={<DeleteOutlined />} onClick={onRemoveBank}></Button>
                </Space>
              ) : (
                <Typography.Text className="ant-form-text" type="secondary">
                  ( <SmileOutlined /> Chưa có tài khoản ngân hàng. )
                </Typography.Text>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Space direction={'horizontal'}>
              <Button
                htmlType="button"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenAddressForm(true);
                }}
              >
                Thêm địa chỉ mặc định
              </Button>
              <Button
                htmlType="button"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenBankForm(true);
                }}
              >
                Thêm ngân hàng mặc định
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Alert message="Lưu ý khi tạo tài khoản" description="Luôn thêm thông tin ngân hàng khi tạo tài khoản cho shop" type="info" showIcon />
        <ModalAddressForm
          open={openAddressForm}
          onCancel={() => {
            setOpenAddressForm(false);
          }}
        />
        <ModalBankForm
          open={openBankForm}
          onCancel={() => {
            setOpenBankForm(false);
          }}
        />
      </Form.Provider>
    </Create>
  );
};
