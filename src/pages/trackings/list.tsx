import { DateField, Show } from '@refinedev/antd';
import { GetListResponse, IResourceComponentsProps, useApiUrl, useCustom } from '@refinedev/core';
import { Card, Col, Divider, Input, Row, Timeline, Typography } from 'antd';
import { TimelineItemProps } from 'antd/es/timeline/TimelineItem';
import { useEffect, useState } from 'react';

import { ITracking, ITrackingResponse } from '../../interfaces/types';
import { APIEndPoint } from '../../utils';

export const TrackingList: React.FC<IResourceComponentsProps<GetListResponse<{}>>> = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [searchEnabled, setSearchEnable] = useState<boolean>(false);
  const [dataTracking, setDataTracking] = useState<TimelineItemProps[]>([]);
  const apiUrl = useApiUrl();

  const { data, isError, isLoading, isSuccess } = useCustom<ITrackingResponse>({
    config: {
      query: {
        trackingId: trackingId,
      },
    },
    method: 'get',
    queryOptions: {
      enabled: searchEnabled && trackingId !== '',
    },
    url: `${apiUrl}/${APIEndPoint.TRACKINGS}`,
  });

  useEffect(() => {
    if (isSuccess) {
      setSearchEnable(false);
      const trackings = data?.data?.data?.trackings.map((item: ITracking) => {
        return {
          children: renderContent(item),
          label: renderDateTime(item.createdAt),
        };
      });
      setDataTracking(trackings);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSearchEnable(false);
      setDataTracking([]);
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
    <Show title="Theo dõi đơn hàng" headerButtons={[]}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
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
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={24}>
                <Card loading={isLoading && searchEnabled} title={`Hành trình mã đơn hàng ${trackingId}`}>
                  <Timeline mode={'left'} items={dataTracking} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
