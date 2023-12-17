import { Create, DateField } from '@refinedev/antd';
import { IResourceComponentsProps, useTranslate } from '@refinedev/core';
import { Alert, Button, Divider, Form, Space, Table, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import React, { useMemo } from 'react';
import { StringUtils } from 'utils';

import { useCopyToClipboard } from '../../hooks';
import { ReconciliationOrder, useReconciliationOrdersCreate } from './create.hook';

export const ReconciliationOrderCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { error, formProps, handleImport, handleSubmit, loadingImport, reconciliationItems, saveButtonProps } = useReconciliationOrdersCreate();
  const [copyToClipboard, copyResult] = useCopyToClipboard();
  const columns = useMemo<(ColumnGroupType<ReconciliationOrder> | ColumnType<ReconciliationOrder>)[]>(() => {
    return [
      {
        render: (value, record, index) => {
          return index + 1;
        },
        title: 'STT',
      },
      {
        dataIndex: 'tracking_id',
        title: translate('reconciliationOrders.fields.trackingId'),
      },
      {
        align: 'center',
        dataIndex: 'created_order_date',
        render: (value, record, index) => {
          return value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />;
        },
        title: translate('reconciliationOrders.fields.startDate'),
      },
      {
        align: 'center',
        dataIndex: 'successful_delivery_date',
        render: (value, record, index) => {
          return value && <DateField value={value} format={'DD-MM-YYYY'} locales={'vi'} />;
        },
        title: translate('reconciliationOrders.fields.endDate'),
      },
      {
        align: 'center',
        dataIndex: 'status',
        title: translate('reconciliationOrders.fields.statusOrder'),
      },
      {
        align: 'center',
        dataIndex: 'cost_on_delivery',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.COD'),
      },
      {
        align: 'center',
        dataIndex: 'shipment_fee',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.shipmentFee'),
      },
      {
        align: 'center',
        dataIndex: 'carrier_weight',
        title: translate('reconciliationOrders.fields.weight'),
      },
      {
        align: 'center',
        dataIndex: 'return_fee',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.returnFee'),
      },
      {
        align: 'center',
        dataIndex: 'insurance_fee',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.insuranceFee'),
      },
      {
        align: 'center',
        dataIndex: 'change_fee',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.changeFee'),
      },
      {
        align: 'center',
        dataIndex: 'other_fee',
        render: value => value && StringUtils.convertNumberToCurrency(value),
        title: translate('reconciliationOrders.fields.otherFee'),
      },
    ];
  }, [translate]);

  return (
    <Create title={translate('reconciliationOrders.title.create')} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" labelAlign="left" labelWrap onFinish={handleSubmit}>
        <Space direction={'vertical'}>
          <input type={'file'} onChange={handleImport} />
          <Typography.Link href={'https://docs.google.com/spreadsheets/d/1Zk7Kvtk6IYQF9Toba4AQbhPPnUL-cxfj7-W6pxXsVBI/edit?usp=sharing'} target={'_blank'}>
            {translate('reconciliationOrders.title.template')}
          </Typography.Link>
        </Space>
      </Form>
      <Divider></Divider>
      {error && (
        <>
          <Alert
            banner
            message={error.title}
            description={
              <Space direction={'vertical'}>
                <Typography.Text
                  copyable={{
                    tooltips: [translate('reconciliationOrders.tooltips.copy'), translate('reconciliationOrders.tooltips.copied')],
                  }}
                >
                  {error.trackingIds.join(', ')}
                </Typography.Text>
                <Typography.Text>{error.subtitle}</Typography.Text>
              </Space>
            }
            type="error"
            showIcon
            action={
              <Button
                size="small"
                type="text"
                onClick={async () => {
                  await copyToClipboard(error.trackingIds.join('\n '));
                }}
              >
                {copyResult?.state === 'success' ? translate('reconciliationOrders.tooltips.copied') : translate('reconciliationOrders.tooltips.copy')}
                {copyResult?.state === 'error' && translate('reconciliationOrders.tooltips.copyError')}
              </Button>
            }
          />
          <Divider></Divider>
        </>
      )}
      <Table dataSource={reconciliationItems} pagination={false} size={'small'} rowKey={() => StringUtils.uuidv4()} columns={columns} loading={loadingImport}></Table>
    </Create>
  );
};
