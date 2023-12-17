import { LoginPageProps, LoginFormTypes, useLink, useRouterType } from '@refinedev/core';
import { useLogin, useTranslate, useRouterContext } from '@refinedev/core';
import { Row, Col, Layout, Card, Typography, Form, Input, Button, Checkbox, CardProps, LayoutProps, FormProps, Image, theme, Space, Grid } from 'antd';
import { GHNIcon, GHTKIcon, NinjavanIcon } from 'components';
import React from 'react';

import { bodyStyles, centerContainerStyles, containerStyles, headStyles, layoutStyles, rightContainerStyles, titleStyles } from './styles';

const { Text, Title } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPageCustom: React.FC<LoginProps> = ({ contentProps, forgotPasswordLink, formProps, rememberMe, title, wrapperProps }) => {
  const { token } = useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const { lg, xl, xs, xxl } = useBreakpoint();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  const { isLoading, mutate: login } = useLogin<LoginFormTypes>();

  const PageTitle =
    title === false ? null : (
      <Space direction={'vertical'} align={'center'}>
        <Image width={80} height={80} src={'/images/logo/bigsizeship_logo.png'} alt={''} preview={false} />
        <Title
          level={3}
          style={{
            color: token.colorPrimaryTextHover,
            fontSize: '18px',
            fontWeight: 'bold',
            ...titleStyles,
          }}
        >
          {translate('pages.login.title', 'Sign in to your account')}
        </Title>
      </Space>
    );

  const CardTitle = (
    <Title style={{ fontSize: 18, fontWeight: '400', margin: 0 }}>
      Chào mừng bạn quay lại{' '}
      <span
        style={{
          color: '#f70200',
          fontSize: '20px',
          fontStyle: 'italic',
          fontWeight: 'bold',
        }}
      >
        Bigsizeship
      </span>
    </Title>
  );

  const CardContent = (
    <Card
      title={CardTitle}
      headStyle={headStyles}
      bodyStyle={bodyStyles}
      style={{
        ...containerStyles,
        backgroundColor: '#00000000',
        zIndex: 2,
      }}
      {...(contentProps ?? {})}
    >
      <Form<LoginFormTypes>
        layout="vertical"
        form={form}
        onFinish={values => login(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
        {...formProps}
      >
        <Form.Item
          name="email"
          label={translate('pages.login.fields.email', 'Email')}
          rules={[
            { required: true },
            {
              message: translate('pages.login.errors.validEmail', 'Địa chỉ email không hợp lệ'),
              type: 'email',
            },
          ]}
        >
          <Input size="large" placeholder={translate('pages.login.fields.email', 'Email')} />
        </Form.Item>
        <Form.Item
          name="password"
          label={translate('pages.login.fields.password', 'Password')}
          rules={[
            { message: 'Vui lòng nhập password', required: true },
            {
              message: 'Mật khẩu không được chứa khoảng trắng',
              pattern: /^\S+$/,
            },
          ]}
        >
          <Input.Password type="password" placeholder="●●●●●●●●" size="large" />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          {rememberMe ?? (
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                style={{
                  fontSize: '12px',
                }}
              >
                {translate('pages.login.buttons.rememberMe', 'Remember me')}
              </Checkbox>
            </Form.Item>
          )}
          {/*{forgotPasswordLink ?? (*/}
          {/*  <ActiveLink*/}
          {/*    style={{*/}
          {/*      color: token.colorPrimaryTextHover,*/}
          {/*      fontSize: "12px",*/}
          {/*      marginLeft: "auto",*/}
          {/*    }}*/}
          {/*    to="/forgot-password"*/}
          {/*  >*/}
          {/*    {translate(*/}
          {/*      "pages.login.buttons.forgotPassword",*/}
          {/*      "Forgot password?",*/}
          {/*    )}*/}
          {/*  </ActiveLink>*/}
          {/*)}*/}
        </div>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" loading={isLoading} block>
            {translate('pages.login.signin', 'Sign in')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const leftContent = () => {
    return (
      <Col
        xs={0}
        lg={12}
        style={{
          backgroundColor: token.colorPrimary,
          height: '100%',
          width: '100%',
        }}
      >
        <Row style={{ height: '100%', width: '100%' }} align="middle" justify="space-between">
          <Col span={24} style={{ marginBottom: '50%', padding: '8%' }}>
            <Space
              direction={'vertical'}
              align={'start'}
              style={{
                width: '100%',
              }}
            >
              <Title
                level={1}
                style={{
                  color: token.colorWhite,
                  fontSize: 60,
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                BIGSIZESHIP
              </Title>
              <Text style={{ color: token.colorWhite, fontWeight: 'bold' }}>Cổng kết nối các đơn vị vận chuyển hàng đầu tại Việt Nam</Text>
            </Space>
          </Col>
          <Col
            span={24}
            style={{
              bottom: 0,
              position: 'absolute',
              width: '100%',
            }}
          >
            <Image width={'100%'} style={{ mixBlendMode: 'darken' }} src={'/images/assets/city_left.svg'} alt={''} preview={false} />
          </Col>
        </Row>
      </Col>
    );
  };

  const rightContent = () => {
    return (
      <Col xs={24} lg={12} style={rightContainerStyles}>
        {PageTitle}
        {CardContent}
        <Space direction={'vertical'} align={'center'}>
          <Typography.Text>Kết nối các đơn vị vận chuyển</Typography.Text>
          <Space direction={'horizontal'} align={'center'}>
            <GHNIcon size={36} />
            <NinjavanIcon size={36} />
            <GHTKIcon size={36} />
          </Space>
          <Image width={'150px'} style={{ mixBlendMode: 'darken' }} src={'/images/assets/inform.svg'} alt={''} preview={false} />
        </Space>
        <div
          style={{
            bottom: 0,
            position: 'absolute',
            width: '100%',
          }}
        >
          <Image
            width={'100%'}
            style={{
              mixBlendMode: 'darken',
            }}
            src={'/images/assets/city_right.svg'}
            alt={''}
            preview={false}
          />
        </div>
        <Space style={{ bottom: 10, position: 'absolute', width: '100%' }} direction={'vertical'} align={'center'}>
          <Typography.Text>Copyright 2023 © BigsizeShip</Typography.Text>
        </Space>
      </Col>
    );
  };

  const centerContent = () => {
    return (
      <Col xs={0} sm={0} lg={12} style={centerContainerStyles}>
        <Image width={'70%'} style={{ mixBlendMode: 'darken' }} src={'/images/assets/shipper_bike_v2.svg'} alt={''} preview={false} />
      </Col>
    );
  };

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <div
        style={{
          height: '100vh',
          width: '100%',
        }}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            backgroundColor: token.colorBgElevated,
            display: 'flex',
            height: '100vh',
            width: '100%',
          }}
        >
          {!xs && leftContent()}
          {rightContent()}
          {(lg || xl || xxl) && centerContent()}
        </Row>
      </div>
    </Layout>
  );
};
