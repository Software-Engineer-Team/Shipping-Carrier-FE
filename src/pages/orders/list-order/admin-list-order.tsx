import { ExclamationOutlined, ExportOutlined, MinusCircleTwoTone, PlusCircleTwoTone, PrinterOutlined, RedoOutlined } from '@ant-design/icons';
import { DateField, DeleteButton, EditButton, List } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Button, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useMemo } from 'react';

import { GHNIcon, GHTKIcon, NinjavanIcon, OrderExpandable } from '../../../components';
import { AirwayBill } from '../../../components/airway-bill';
import { IOrder, OrderStatus } from '../../../interfaces/types';
import { APIEndPoint, StringUtils } from '../../../utils';
import { AdminSearchForm } from '../components/admin-search-form';
import { AdminExportForm } from '../components/export-form';
import { useAdminListOrder } from './admin-list-order.hook';

export const AdminListOrder = () => {
  const translate = useTranslate();
  const {
    handleCloseExportForm,
    handleExportExcel,
    handleOpenExportForm,
    handlePrintAWBs,
    handleRefetchOrder,
    handleSelectedAWBs,
    isExportFormOpen,
    isLoadingOrder,
    isRefetchingOrder,
    modalAWBProps,
    orderData,
    recordAWBs,
    rowSelection,
    searchFormProps,
    selectedRowKeys,
    tableProps,
  } = useAdminListOrder();

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
        render: (value, record, index) => {
          return (
            <Tooltip title={record.carrier_account.account_name} placement={'left'}>
              <Typography.Paragraph
                copyable={{
                  tooltips: ['Copy mã đơn hàng', 'Đã copy'],
                }}
              >
                {value}
              </Typography.Paragraph>
            </Tooltip>
          );
        },
        title: translate('orders.titles.trackingId'),
      },
      {
        dataIndex: ['carrier', 'name'],
        render: (value, record, index) => getIconCarrier(value),
        title: translate('orders.titles.carrier'),
      },
      {
        dataIndex: ['customer', 'username'],
        title: translate('orders.titles.customer'),
      },
      {
        dataIndex: ['customer', 'sale', 'username'],
        title: translate('orders.titles.sale'),
      },
      {
        dataIndex: 'to_name',
        title: translate('orders.titles.toName'),
      },
      {
        align: 'center',
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
        render: (value, record, index) => {
          return (
            <Space direction={'vertical'}>
              <Tag color={StringUtils.getStatusOrderColor(value)}>{value}</Tag>
              <Tag>{record.is_reconciled ? 'Đã đối soát' : 'Chưa đối soát'}</Tag>
            </Space>
          );
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
            <Tooltip title={translate('orders.titles.editOrder')}>
              <EditButton hideText size="small" recordItemId={record.id} />
            </Tooltip>

            <Tooltip title={translate('orders.titles.printOrderSizeA5')}>
              <Button
                size="small"
                icon={<PrinterOutlined />}
                onClick={async () => {
                  await handlePrintAWBs([record]);
                }}
              />
            </Tooltip>
            <Tooltip title={record?.status === OrderStatus.PENDING_PICKUP ? translate('orders.titles.cancelOrder') : 'Không thể huỷ đơn đang vận chuyển'}>
              <DeleteButton
                hideText
                size="small"
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
        title: translate('orders.titles.action'),
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
              await handleRefetchOrder();
            }}
            key={'refresh_button'}
          >
            {translate('buttons.refresh')}
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col lg={24} xs={24}>
            <AdminSearchForm searchFormProps={searchFormProps} />
          </Col>
          <Col lg={24} xs={24}>
            <Card
              title={translate('orders.titles.searchResults', {
                total: orderData?.total,
                totalSelected: selectedRowKeys.length,
              })}
              extra={
                <Space direction={'horizontal'}>
                  <Tooltip title={translate('orders.titles.selectOrderToPrint')}>
                    <Button icon={<PrinterOutlined />} onClick={handleSelectedAWBs}>
                      In hàng loạt
                    </Button>
                  </Tooltip>
                  <Tooltip title={translate('orders.titles.selectOrderToExport')}>
                    <Button icon={<ExportOutlined />} onClick={handleExportExcel}>
                      Xuất file đã chọn
                    </Button>
                  </Tooltip>
                  <Tooltip title={translate('orders.titles.orderToExportAll')}>
                    <Button icon={<ExportOutlined />} onClick={handleOpenExportForm}>
                      Xuất toàn bộ
                    </Button>
                  </Tooltip>
                </Space>
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
      <AdminExportForm isModalOpen={isExportFormOpen} handleCancel={handleCloseExportForm}></AdminExportForm>
    </>
  );
};
