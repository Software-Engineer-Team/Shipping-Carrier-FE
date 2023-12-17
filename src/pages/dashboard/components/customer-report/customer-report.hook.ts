import { PieConfig, measureTextWidth } from '@ant-design/charts';
import { CrudFilter, useApiUrl, useCustom } from '@refinedev/core';
import { DatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { ReportResponse } from 'interfaces/types';
import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { APIEndPoint, getDateOrders } from 'utils';

export function useCustomerReport() {
  const startDate = dayjs().startOf('D');
  const endDate = dayjs();
  const apiUrl = useApiUrl();
  const [reportFilters, setReportFilters] = useState<CrudFilter[]>([
    {
      field: 'createdAt',
      operator: 'gte',
      value: startDate.toISOString(),
    },
    {
      field: 'createdAt',
      operator: 'lte',
      value: endDate.toISOString(),
    },
  ]);

  const { data, isFetching, isLoading, refetch } = useCustom<ReportResponse>({
    config: {
      filters: reportFilters,
    },
    method: 'get',
    url: `${apiUrl}/${APIEndPoint.REPORT}`,
  });

  const dataChart = useMemo(() => {
    const { cancel_order, delivery_failed, delivery_in_progress, delivery_successful, pending_pickup, return_to_sender } = data?.data?.data?.ordersByCustomer[0]?.reportOrdersByStatus || {};
    return [
      {
        type: 'Đang chờ lấy hàng',
        value: pending_pickup?.orderIds.length || 0,
      },
      {
        type: 'Đang vận chuyển',
        value: delivery_in_progress?.orderIds.length || 0,
      },
      {
        type: 'Vận chuyển thất bại',
        value: delivery_failed?.orderIds.length || 0,
      },
      {
        type: 'Trả lại người gửi',
        value: return_to_sender?.orderIds.length || 0,
      },
      {
        type: 'Giao hàng thành công',
        value: delivery_successful?.orderIds.length || 0,
      },
      {
        type: 'Đơn hàng huỷ',
        value: cancel_order?.orderIds.length || 0,
      },
    ];
  }, [data?.data?.data?.ordersByCustomer]);

  function renderStatistic(containerWidth: number, text: string, style: CSSProperties) {
    const { height: textHeight, width: textWidth } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
  }
  const config: PieConfig = {
    angleField: 'value',
    appendPadding: 12,
    colorField: 'type',
    data: dataChart,
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    label: {
      autoRotate: true,
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      offset: '-50%',
      style: {
        fontSize: 14,
        labelHeight: 40,
        textAlign: 'center',
      },
      type: 'outer',
    },
    pieStyle: {
      lineWidth: 4,
    },
    radius: 1,
    statistic: {
      content: {
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum ? ` ${datum.value}` : `${dataChart.reduce((r, d) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            alignSelf: 'center',
            fontSize: 26,
          });
        },
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
      },
      title: {
        customHtml: (container, view, datum) => {
          const { height, width } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : 'Tổng đơn';
          return renderStatistic(d, text, {
            fontSize: 20,
          });
        },
        offsetY: -4,
      },
    },
  };

  const listStatus = useMemo(() => {
    if (data?.data?.data?.totalReportOrdersByStatus) {
      const { cancel_order, delivery_failed, delivery_in_progress, delivery_successful, pending_pickup, return_to_sender } = data?.data?.data?.totalReportOrdersByStatus;
      return [
        {
          status: pending_pickup,
          title: 'Đang chờ lấy hàng',
        },
        {
          status: delivery_in_progress,
          title: 'Đang vận chuyển',
        },
        {
          status: delivery_failed,
          title: 'Vận chuyển thất bại',
        },
        {
          status: return_to_sender,
          title: 'Trả lại người gửi',
        },
        {
          status: delivery_successful,
          title: 'Giao hàng thành công',
        },
        {
          status: cancel_order,
          title: 'Đơn hàng huỷ',
        },
      ];
    } else {
      return [];
    }
  }, [data?.data?.data?.totalReportOrdersByStatus]);

  const handleOnRangePickerChange = useCallback(
    async (value: DatePickerProps['value'] | RangePickerProps['value'], dateString: [string, string] | string) => {
      const dates = getDateOrders([dayjs(dateString[0]), dayjs(dateString[1])]);
      setReportFilters([
        {
          field: 'createdAt',
          operator: 'gte',
          value: dates[0].toISOString(),
        },
        {
          field: 'createdAt',
          operator: 'lte',
          value: dates[1].toISOString(),
        },
      ]);
      await refetch();
    },
    [refetch],
  );
  return { config, data, endDate, handleOnRangePickerChange, isFetching, isLoading, listStatus, startDate };
}
