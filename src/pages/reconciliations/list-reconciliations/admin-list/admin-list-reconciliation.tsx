import { ExportOutlined } from '@ant-design/icons';
import { DateField, List } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Button, Col, Modal, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';

import { IReconciliation } from '../../../../interfaces/types';
import { StringUtils } from '../../../../utils';
import { AdminSearchForm } from '../../components/AdminSearchForm';
import { useAdminListReconciliation } from './admin-list-reconciliation.hook';

export const AdminListReconciliation: React.FC = () => {
  const translate = useTranslate();
  const { confirmLoading, handleConfirm, handleExportExcel, handleSelectAction, modalText, onCloseModal, onShowModal, open, searchFormProps, tableProps } = useAdminListReconciliation();

  const columns = useMemo<(ColumnGroupType<IReconciliation> | ColumnType<IReconciliation>)[]>(() => {
    return [
      {
        dataIndex: 'id',
        title: translate('reconciliations.fields.reconciliationId'),
      },
      {
        dataIndex: ['customer', 'username'],
        title: translate('reconciliations.fields.customer'),
      },
      {
        dataIndex: ['customer', 'sale', 'username'],
        title: translate('reconciliations.fields.sale'),
      },
      {
        align: 'center',
        dataIndex: ['reconciliation_orders', 'length'],
        title: translate('reconciliations.fields.totalOrders'),
      },
      {
        align: 'center',
        dataIndex: 'status',
        render: value => {
          return <Tag color={StringUtils.getStatusColor(value)}>{StringUtils.getStatusReconciliationTitle(value)}</Tag>;
        },
        title: translate('reconciliations.fields.status'),
      },
      {
        align: 'center',
        dataIndex: 'total_customer_refund',
        render: value => {
          return (
            <Typography.Paragraph strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Typography.Paragraph>
          );
        },
        title: translate('reconciliations.fields.totalCustomerRefund'),
      },
      {
        align: 'center',
        dataIndex: 'total_system_revenue',
        render: value => {
          return (
            <Typography.Paragraph strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
              {StringUtils.convertNumberToCurrency(value)}
            </Typography.Paragraph>
          );
        },
        title: translate('reconciliations.fields.totalSystemRevenue'),
      },
      {
        align: 'center',
        dataIndex: 'createdAt',
        render: value => value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />,
        title: translate('reconciliations.fields.createdAt'),
      },
      {
        align: 'center',
        dataIndex: 'updatedAt',
        render: value => value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />,
        title: translate('reconciliations.fields.updatedAt'),
      },
      {
        align: 'center',
        render: (_, record) => {
          return (
            <Space>
              <Select
                style={{ width: '100%' }}
                placeholder={'Hành động'}
                options={[
                  {
                    disabled: record.status === 'completed',
                    label: 'Xác thực',
                    value: 'confirmed',
                  },
                  {
                    disabled: record.status === 'completed',
                    label: 'Hủy',
                    value: 'cancelled',
                  },
                  {
                    label: 'Xem',
                    value: 'show',
                  },
                ]}
                onSelect={value => {
                  handleSelectAction(value, record);
                }}
              ></Select>
            </Space>
          );
        },
        title: translate('reconciliations.fields.action'),
      },
    ];
  }, [handleSelectAction, translate]);

  return (
    <List
      title={translate('reconciliations.titles.list')}
      headerButtons={[
        <Tooltip title={translate('orders.titles.selectOrderToExport')} key={'export_order'}>
          <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
            {translate('reconciliations.buttons.export')}
          </Button>
        </Tooltip>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AdminSearchForm searchFormProps={searchFormProps}></AdminSearchForm>
        </Col>
        <Col span={24}>
          <Table
            {...tableProps}
            rowKey={() => StringUtils.uuidv4()}
            pagination={{
              ...tableProps.pagination,
              showSizeChanger: true,
            }}
            columns={columns}
          />
        </Col>
      </Row>

      <Modal title={translate('reconciliations.titles.confirmStatus')} open={open} onOk={handleConfirm} confirmLoading={confirmLoading} onCancel={onCloseModal}>
        <p>{modalText}</p>
      </Modal>
    </List>
  );
};
