import { theme } from 'antd';

export const CustomFooter = (props: any) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: token.colorBgElevated,
        color: token.colorText,
        display: 'flex',
        height: '48px',
        justifyContent: 'center',
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};
