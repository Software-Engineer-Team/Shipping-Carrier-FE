import { DateField, Show } from '@refinedev/antd';
import { IResourceComponentsProps, useApiUrl, useCustom } from '@refinedev/core';
import { Card, Col, Divider, Input, Row, Timeline, TimelineItemProps, Typography } from 'antd';
import { IOrder } from 'interfaces/types';
import { useEffect, useState } from 'react';
import { APIEndPoint } from 'utils';
interface ITracking {
  id: string;
  tracking_id: string;
  createdAt: Date;
  status: string;
  description: string;
  weight: number;
}

interface ITrackingResponse {
  order: IOrder;
  trackings: ITracking[];
}
export const TrackingShow: React.FC<IResourceComponentsProps> = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [searchEnabled, setSearchEnable] = useState<boolean>(false);
  const [dataTracking, setDataTracking] = useState<TimelineItemProps[]>([]);
  const apiUrl = useApiUrl();

  const { data, isError, isSuccess } = useCustom<ITrackingResponse>({
    config: {
      query: {
        trackingId: trackingId,
      },
    },
    method: 'get',
    queryOptions: {
      enabled: searchEnabled,
    },
    url: `${apiUrl}/${APIEndPoint.TRACKINGS}`,
  });

  useEffect(() => {
    if (isSuccess) {
      setSearchEnable(false);
      setDataTracking(
        data?.data.trackings.map((item: ITracking) => {
          return {
            children: renderContent(item),
            label: renderDateTime(item.createdAt),
          };
        }),
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSearchEnable(false);
    }
  }, [isError]);

  const renderContent = (item: ITracking) => {
    return (
      <>
        <Typography.Text>{item.status}</Typography.Text>
        <br />
        <Typography.Text>{item.description}</Typography.Text>
      </>
    );
  };

  const renderDateTime = (value: Date) => {
    return <DateField value={value} format={'HH:mm, dddd, DD/MM/YYYY'} />;
  };

  return (
    <Show title="Theo dõi đơn hàng">
      <Row gutter={[16, 16]}>
        <Col lg={24} xs={24}>
          <Card title="Tìm kiếm">
            <Input.Search
              placeholder={'Nhập mã đơn hàng'}
              allowClear
              onChange={e => {
                e.preventDefault();
                setTrackingId(e.target.value);
              }}
              enterButton="Tìm kiếm"
              onSearch={() => {
                setSearchEnable(true);
              }}
            />
            <Divider />
            <Card loading={isSuccess} title={`Hành trình mã đơn hàng ${trackingId}`}>
              <Timeline mode={'left'} items={dataTracking} />
            </Card>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
