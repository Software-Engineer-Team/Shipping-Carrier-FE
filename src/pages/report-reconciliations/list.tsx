import { ExportOutlined } from '@ant-design/icons';
import { List } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCan, useCustom } from '@refinedev/core';
import { CrudFilters } from '@refinedev/core/dist/interfaces';
import { Button, Col, Row, Table, Tooltip, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';

import { IProfit, IReportReconciliation } from '../../interfaces/types';
import { APIEndPoint, columnsExportReportReconciliation, exportToExcel, StringUtils } from '../../utils';
import { SearchForm } from './components/search-form';

export const ReportReconciliationsList: React.FC<IResourceComponentsProps> = () => {
  const apiUrl = useApiUrl();
  const { data: canAccessRevenue } = useCan({
    action: 'field',
    params: { field: 'revenue' },
    resource: 'report-reconciliations',
  });
  const { data: canAccessPartner } = useCan({
    action: 'field',
    params: { field: 'partner' },
    resource: 'report-reconciliations',
  });
  const [filter, setFilter] = React.useState<CrudFilters>([
    {
      field: 'createdAt',
      operator: 'gte',
      value: dayjs().startOf('d').toISOString(),
    },
    {
      field: 'createdAt',
      operator: 'lte',
      value: dayjs().toISOString(),
    },
  ]);
  const { data, isLoading, isRefetching, refetch } = useCustom<IReportReconciliation>({
    config: {
      filters: filter,
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.RECONCILIATIONS_PROFIT}`,
  });

  const handleExport = useCallback(async () => {
    if (data?.data?.data?.profits) {
      let injectedKeys = [];
      if (!canAccessRevenue?.can) {
        injectedKeys.push('totalSystemRevenue');
      }
      if (!canAccessPartner?.can) {
        injectedKeys.push('totalPartnerCOD');
        injectedKeys.push('totalPartnerShipmentFee');
        injectedKeys.push('totalPartnerInsuranceFee');
        injectedKeys.push('totalPartnerOtherFee');
        injectedKeys.push('totalPartnerChangeFee');
        injectedKeys.push('totalPartnerReturnFee');
      }
      const columnsExport = columnsExportReportReconciliation(injectedKeys);
      exportToExcel(data?.data?.data?.profits, columnsExport, 'BSS - Báo cáo đối soát');
    }
  }, [canAccessPartner?.can, canAccessRevenue?.can, data?.data?.data?.profits]);

  const renderCellSummary = (value: number = 0, index: number, isCurrency: boolean = true) => {
    return (
      <Table.Summary.Cell index={1} align={'center'}>
        <Typography.Text strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
          {isCurrency ? StringUtils.convertNumberToCurrency(value) : value}
        </Typography.Text>
      </Table.Summary.Cell>
    );
  };

  const columns = useMemo<(ColumnGroupType<IProfit> | ColumnType<IProfit>)[]>(() => {
    return [
      {
        fixed: 'left',
        render: (value, record, index) => {
          return <Typography.Text>{index + 1}</Typography.Text>;
        },
        title: 'STT',
        width: 80,
      },
      {
        dataIndex: ['customer', 'username'],
        fixed: 'left',
        title: 'Khách hàng',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalOrders',
        title: 'Tổng đơn hàng',
        width: 150,
      },
      // report system
      {
        align: 'center',
        dataIndex: 'totalSystemCOD',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Thu hộ',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalSystemShipmentFee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Phí giao hàng',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalSystemReturnFee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Phí hoàn',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalSystemInsuranceFee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Phí bảo hiểm',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalSystemOtherFee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Phí khác',
        width: 150,
      },
      {
        align: 'center',
        dataIndex: 'totalSystemChangeFee',
        render: value => StringUtils.convertNumberToCurrency(value),
        title: 'Phí đổi địa chỉ',
        width: 150,
      },
      // report partner
      ...(canAccessPartner?.can
        ? [
            {
              align: 'center',
              dataIndex: 'totalPartnerCOD',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Thu hộ (file)',
              width: 150,
            } as ColumnType<IProfit>,
            {
              align: 'center',
              dataIndex: 'totalPartnerShipmentFee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Phí giao hàng (file)',
              width: 150,
            } as ColumnType<IProfit>,
            {
              align: 'center',
              dataIndex: 'totalPartnerInsuranceFee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Phí hoàn hàng (file)',
              width: 150,
            } as ColumnType<IProfit>,
            {
              align: 'center',
              dataIndex: 'totalPartnerOtherFee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Phí khác (file)',
              width: 150,
            } as ColumnType<IProfit>,
            {
              align: 'center',
              dataIndex: 'totalPartnerChangeFee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Phí đổi địa chỉ (file)',
              width: 150,
            } as ColumnType<IProfit>,
            {
              align: 'center',
              dataIndex: 'totalPartnerReturnFee',
              render: value => StringUtils.convertNumberToCurrency(value),
              title: 'Phí hoàn (file)',
              width: 150,
            } as ColumnType<IProfit>,
          ]
        : []),
      {
        align: 'center',
        dataIndex: 'totalCustomerRefund',
        render: value => (
          <Typography.Paragraph strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
            {StringUtils.convertNumberToCurrency(value)}
          </Typography.Paragraph>
        ),
        title: (
          <Tooltip title={'= Tổng COD - Cước - Phí bảo hiểm (nếu có) - Phí hoàn hàng (nếu có)'}>
            <Typography.Text>Tổng hoàn khách</Typography.Text>
          </Tooltip>
        ),
        width: 150,
      },
      ...(canAccessRevenue?.can
        ? [
            {
              align: 'center',
              dataIndex: 'totalSystemRevenue',
              render: value => (
                <Typography.Paragraph strong style={{ color: value > 0 ? 'green' : 'red', margin: 0 }}>
                  {StringUtils.convertNumberToCurrency(value)}
                </Typography.Paragraph>
              ),
              title: (
                <Tooltip title={'= Giá bán - Giá mua từ file đối soát'}>
                  <Typography.Text>Lợi nhuận</Typography.Text>
                </Tooltip>
              ),
              width: 150,
            } as ColumnType<IProfit>,
          ]
        : []),
      {
        dataIndex: ['customer', 'sale', 'username'],
        fixed: 'right',
        title: 'Sale',
        width: 150,
      },
    ];
  }, [canAccessPartner?.can, canAccessRevenue?.can]);

  return (
    <List
      title={'Báo cáo đối soát'}
      headerButtons={[
        <Button onClick={handleExport} icon={<ExportOutlined />} key={'reconciliation_export_button'}>
          Xuất excel
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SearchForm
            onSubmit={async (filters: CrudFilters) => {
              setFilter(filters);
              await refetch();
            }}
          />
        </Col>
        <Col span={24}>
          <Table
            loading={isLoading || isRefetching}
            scroll={{ x: 1500 }}
            bordered={true}
            dataSource={data?.data?.data?.profits}
            pagination={false}
            columns={columns}
            summary={() => {
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Typography.Text strong> Tổng</Typography.Text>
                  </Table.Summary.Cell>
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalOrders, 1, false)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemCOD, 2)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemShipmentFee, 3)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemReturnFee, 4)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemInsuranceFee, 5)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemOtherFee, 6)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemChangeFee, 7)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerCOD, 8)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerShipmentFee, 9)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerInsuranceFee, 10)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerOtherFee, 11)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerChangeFee, 12)}
                  {canAccessPartner?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalPartnerReturnFee, 13)}
                  {renderCellSummary(data?.data?.data?.totalProfitReport?.totalCustomerRefund, 14)}
                  {canAccessRevenue?.can && renderCellSummary(data?.data?.data?.totalProfitReport?.totalSystemRevenue, 15)}
                </Table.Summary.Row>
              );
            }}
          ></Table>
        </Col>
      </Row>
    </List>
  );
};
