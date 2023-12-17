import { ExclamationOutlined, ExportOutlined, MinusCircleTwoTone, PlusCircleTwoTone, PrinterOutlined, RedoOutlined } from '@ant-design/icons';
import { DateField, DeleteButton, List } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Button, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useMemo } from 'react';

import { GHNIcon, GHTKIcon, NinjavanIcon, OrderExpandable } from '../../../components';
import { AirwayBill } from '../../../components/airway-bill';
import { IOrder, OrderStatus } from '../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../utils';
import { CustomerSearchForm } from '../components/customer-search-form/customer-search-form';
import { useCustomerListOrder } from './customer-list-order.hook';

export const CustomerListOrder = () => {
  const translate = useTranslate();
  const { dataOrder, handleExportExcel, handlePrintAWBs, handleSelectedAWBs, isLoadingOrder, isRefetchingOrder, modalAWBProps, recordAWBs, refetchOrder, rowSelection, searchFormProps, tableProps } =
    useCustomerListOrder();

  const getIconCarrier = (type: string | number) => {
    switch (type) {
      case 'GHN':
        return <GHNIcon />;
      case 'GHTK':
        return <GHTKIcon />;
      case 'NINJAVAN':
        return <NinjavanIcon />;
      default:
        return <ExclamationOutlined />;
    }
  };

  // ======================== Columns Table ========================
  const columns = useMemo<(ColumnGroupType<IOrder> | ColumnType<IOrder>)[]>(() => {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
      },
      {
        dataIndex: 'tracking_id',
        render: value => {
          return (
            <Typography.Paragraph
              copyable={{
                tooltips: ['Copy mã đơn hàng', 'Đã copy'],
              }}
            >
              {value}
            </Typography.Paragraph>
          );
        },
        title: translate('orders.titles.trackingId'),
      },
      {
        align: 'center',
        dataIndex: ['carrier', 'name'],
        render: (value, record, index) => getIconCarrier(value),
        title: translate('orders.titles.carrier'),
      },
      {
        dataIndex: 'from_name',
        title: translate('orders.titles.fromName'),
      },
      {
        dataIndex: 'to_name',
        title: translate('orders.titles.toName'),
      },
      {
        dataIndex: 'to_phone_number',
        render: value => (
          <Typography.Paragraph
            copyable={{
              tooltips: ['Copy số điện thoại', 'Đã copy'],
            }}
          >
            {value}
          </Typography.Paragraph>
        ),
        title: translate('orders.titles.toPhoneNumber'),
      },
      {
        align: 'center',
        dataIndex: 'cash_on_delivery',
        render: value => <Typography>{StringUtils.formatterCurrency(value)}</Typography>,
        title: translate('orders.titles.COD'),
      },
      {
        align: 'center',
        dataIndex: 'shipment_fee',
        render: value => <Typography>{StringUtils.formatterCurrency(value)}</Typography>,
        title: translate('orders.titles.shipmentFee'),
      },
      {
        align: 'center',
        dataIndex: 'status',
        render: value => {
          return <Tag color={StringUtils.getStatusOrderColor(value)}>{value}</Tag>;
        },
        title: translate('orders.titles.statusOrder'),
      },
      {
        align: 'center',
        dataIndex: 'createdAt',
        render: value => value && <DateField value={value} locales={'vi'} lang={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />,
        title: translate('orders.titles.createdAt'),
      },
      {
        align: 'center',
        dataIndex: 'end_date',
        render: value => value && <DateField value={value} locales={'vi'} lang={'vi'} format={'HH:mm, dddd, DD/MM/YYYY'} />,
        title: translate('orders.titles.endDate'),
      },
      {
        align: 'center',
        render: (_, record) => (
          <Space>
            <Tooltip title={translate('orders.titles.printOrderSizeA5')}>
              <Button
                icon={<PrinterOutlined />}
                onClick={async () => {
                  await handlePrintAWBs([record]);
                }}
              />
            </Tooltip>
            <Tooltip title={record?.status === OrderStatus.PENDING_PICKUP ? translate('orders.titles.cancelOrder') : 'Không thể huỷ đơn đang vận chuyển'}>
              <DeleteButton
                hideText
                disabled={record?.status !== OrderStatus.PENDING_PICKUP}
                confirmTitle={'Xác nhận hủy đơn hàng. '}
                confirmOkText={'Hủy đơn hàng'}
                confirmCancelText={'Không huỷ'}
                recordItemId={record.id}
                resource={APIEndPoint.ORDERS_DELETE}
                successNotification={() => {
                  return {
                    description: 'Thành công',
                    message: 'Hủy đơn hàng thành công',
                    type: 'success',
                  };
                }}
                errorNotification={() => {
                  return {
                    description: 'Lỗi',
                    message: 'Lỗi khi hủy đơn hàng',
                    type: 'error',
                  };
                }}
              />
            </Tooltip>
          </Space>
        ),
        title: 'Hành động',
      },
      Table.EXPAND_COLUMN,
    ];
  }, [handlePrintAWBs, translate]);

  return (
    <>
      <List
        title={translate('orders.titles.orderManagement')}
        headerButtons={[
          <Button
            icon={<RedoOutlined spin={isRefetchingOrder} />}
            onClick={async () => {
              await refetchOrder();
            }}
            key={'refresh_button'}
          >
            {translate('buttons.refresh')}
          </Button>,
        ]}
      >
        <Row gutter={[4, 16]}>
          <Col lg={24} xs={24}>
            <CustomerSearchForm searchFormProps={searchFormProps} />
          </Col>
          <Col lg={24} xs={24}>
            <Card
              title={translate('orders.titles.searchResults', {
                total: dataOrder?.total,
              })}
              extra={
                <>
                  <Tooltip title={translate('orders.titles.selectOrderToPrint')}>
                    <Button icon={<PrinterOutlined />} onClick={handleSelectedAWBs} style={{ marginRight: 5 }}>
                      In hàng loạt
                    </Button>
                  </Tooltip>
                  <Tooltip title={translate('orders.titles.selectOrderToExport')}>
                    <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
                      Xuất file
                    </Button>
                  </Tooltip>
                </>
              }
            >
              <Table
                {...tableProps}
                pagination={{
                  ...tableProps.pagination,
                  showSizeChanger: true,
                }}
                rowKey="id"
                size="small"
                loading={isLoadingOrder || isRefetchingOrder}
                columns={columns}
                rowSelection={rowSelection}
                scroll={{ x: 1500 }}
                expandable={{
                  expandedRowRender: record => <OrderExpandable data={record} isLoading={isLoadingOrder} />,
                  expandIcon: ({ expanded, onExpand, record }) =>
                    expanded ? (
                      <Tooltip title={translate('orders.titles.close')}>
                        <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
                      </Tooltip>
                    ) : (
                      <Tooltip title={translate('orders.titles.viewDetails')}>
                        <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
                      </Tooltip>
                    ),
                  expandRowByClick: false,
                }}
              />
            </Card>
          </Col>
        </Row>
      </List>
      <AirwayBill modalProps={modalAWBProps} ordersWithQr={recordAWBs} />
    </>
  );
};
