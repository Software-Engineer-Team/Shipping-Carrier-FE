import { Edit } from '@refinedev/antd';
import { IResourceComponentsProps, useOne, useParsed } from '@refinedev/core';
import { Card, Col, Divider, Row, Table, Typography } from 'antd';
import { IReconciliation } from 'interfaces/types';

export const ReconciliationsEdit: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const { data } = useOne<IReconciliation>({
    id: id,
    resource: 'reconciliations',
  });

  return (
    <Edit title="Xem đối soát">
      <Card title="Phiên đối soát">
        <Row>
          <Col span={12}>
            <Typography.Paragraph strong>Mã phiên: {data?.data?.id}</Typography.Paragraph>
            <Typography.Paragraph strong>Tổng số đơn: {data?.data?.reconciliation_orders.length}</Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph strong>Tổng hoàn trả khách: {data?.data?.total_customer_refund}</Typography.Paragraph>
            <Typography.Paragraph strong>Tổng lợi nhuận: {data?.data?.total_system_revenue}</Typography.Paragraph>
          </Col>
        </Row>
      </Card>
      <Divider />
      <Table dataSource={data?.data?.reconciliation_orders} rowKey="uid">
        <Table.Column dataIndex="tracking_id" title="Mã đơn hàng" />
        <Table.Column dataIndex="partner_cash_on_delivery" title="Phí COD (Vận chuyển)" />
        <Table.Column dataIndex="partner_shipment_fee" title="Phí cước (Vận chuyển)" />
        <Table.Column dataIndex="system_cash_on_delivery" title="Phí COD (Hệ thống)" />
        <Table.Column dataIndex="system_shipment_fee" title="Phí cước (Hệ thống)" />
        <Table.Column dataIndex="system_customer_shipment_fee" title="Phí cước khách hàng (Hệ thống)" />
        <Table.Column dataIndex="system_revenue" title="Lợi nhuận" />
        <Table.Column dataIndex="customer_conciliation" title="Phí hoàn khách" />
      </Table>
    </Edit>
  );
};
