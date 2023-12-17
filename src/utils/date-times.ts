import { TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';

export const getDateOrders = (dates: dayjs.Dayjs[]): dayjs.Dayjs[] => {
  const newDates: dayjs.Dayjs[] = [];
  const [firstDate, secondDate] = dates;
  if (firstDate.isSame(secondDate, 'day')) {
    newDates.push(firstDate.startOf('day'));
    newDates.push(secondDate.endOf('day'));
  } else {
    if (firstDate.isBefore(secondDate, 'day')) {
      newDates.push(firstDate.startOf('day'));
      newDates.push(secondDate.endOf('day'));
    } else {
      newDates.push(secondDate.startOf('day'));
      newDates.push(firstDate.endOf('day'));
    }
  }
  return newDates;
};

export const rangePresets: TimeRangePickerProps['presets'] = [
  { label: 'Hôm nay', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  { label: 'Hôm qua', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
  { label: '7 ngày trước', value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')] },
  { label: '30 ngày trước', value: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')] },
  { label: 'Tuần này', value: [dayjs().startOf('week'), dayjs()] },
  { label: 'Tuần trước', value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')] },
  { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs()] },
  { label: 'Tháng trước', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
];
