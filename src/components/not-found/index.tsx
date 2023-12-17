import { useNavigation } from '@refinedev/core';
import { Button, Result, Image } from 'antd';

export const NotFoundComponent = () => {
  const { list } = useNavigation();
  return (
    <Result
      icon={<Image src={'/images/assets/shipper_bike_v2.svg'} preview={false} width={'20%'} />}
      title="404"
      subTitle="Xin lỗi vì sự bất tiện này, trang bạn đang tìm kiếm không tồn tại."
      extra={
        <Button
          type="primary"
          onClick={() => {
            list('dashboard');
          }}
        >
          Quay về trang chủ
        </Button>
      }
    />
  );
};
