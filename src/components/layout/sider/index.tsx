import { DashboardOutlined, LogoutOutlined, UnorderedListOutlined, BarsOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ThemedTitleV2, useThemedLayoutContext } from '@refinedev/antd';
import {
  useTranslate,
  useLogout,
  useTitle,
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useRouterContext,
  useMenu,
  useRefineContext,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
} from '@refinedev/core';
import { Layout, Menu, Grid, Drawer, Button, theme } from 'antd';
import React, { CSSProperties } from 'react';

import { RefineThemedLayoutV2SiderProps } from '../types';
import { drawerButtonStyles } from './styles';

const { SubMenu } = Menu;
const { useToken } = theme;

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({ activeItemDisabled = false, fixed, meta, render, Title: TitleFromProps }) => {
  const { token } = useToken();
  const { mobileSiderOpen, setMobileSiderOpen, setSiderCollapsed, siderCollapsed } = useThemedLayoutContext();

  const isExistAuthentication = useIsExistAuthentication();
  const routerType = useRouterType();
  const NewLink = useLink();
  const { setWarnWhen, warnWhen } = useWarnAboutChange();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === 'legacy' ? LegacyLink : NewLink;
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { defaultOpenKeys, menuItems, selectedKey } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { hasDashboard } = useRefineContext();
  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const isMobile = typeof breakpoint.lg === 'undefined' ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? ThemedTitleV2;

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map((item: ITreeMenu) => {
      const { children, icon, key, label, meta, name, options, parentName, route } = item;

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name.toLowerCase()}
            action="list"
            params={{
              resource: item,
            }}
          >
            <SubMenu key={item.key} icon={icon ?? <UnorderedListOutlined />} title={label}>
              {renderTreeView(children, selectedKey)}
            </SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(pickNotDeprecated(meta?.parent, options?.parent, parentName) !== undefined && children.length === 0);

      const linkStyle: CSSProperties = activeItemDisabled && isSelected ? { pointerEvents: 'none' } : {};

      return (
        <CanAccess
          key={item.key}
          resource={name.toLowerCase()}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Menu.Item key={item.key} icon={icon ?? (isRoute && <UnorderedListOutlined />)} style={linkStyle}>
            <Link to={route ?? ''} style={linkStyle}>
              {label}
            </Link>
            {!siderCollapsed && isSelected && <div className="ant-menu-tree-arrow" />}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(translate('warnWhenUnsavedChanges', 'Are you sure you want to leave? You have unsaved changes.'));

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <Menu.Item key="logout" onClick={() => handleLogout()} icon={<LogoutOutlined />}>
      {translate('buttons.logout', 'Logout')}
    </Menu.Item>
  );

  const dashboard = hasDashboard ? (
    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
      <Link to="/">{translate('dashboard.title', 'Dashboard')}</Link>
      {!siderCollapsed && selectedKey === '/' && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  ) : null;

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        collapsed: siderCollapsed,
        dashboard,
        items,
        logout,
      });
    }
    return (
      <>
        {dashboard}
        {items}
        {logout}
      </>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        style={{
          border: 'none',
          height: 'calc(100% - 72px)',
          overflow: 'auto',
          paddingTop: '8px',
        }}
        onClick={() => {
          setMobileSiderOpen(false);
        }}
      >
        {renderSider()}
      </Menu>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement="left"
          closable={false}
          width={200}
          bodyStyle={{
            padding: 0,
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
                height: '100vh',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  backgroundColor: token.colorBgElevated,
                  borderBottom: `1px solid ${token.colorBorder}`,
                  display: 'flex',
                  height: '64px',
                  justifyContent: 'flex-start',
                  padding: '0 16px',
                  width: '200px',
                }}
              >
                <RenderToTitle collapsed={false} />
              </div>
              {renderMenu()}
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button style={drawerButtonStyles} size="large" onClick={() => setMobileSiderOpen(true)} icon={<BarsOutlined />}></Button>
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
    padding: '24px 0',
  };

  if (fixed) {
    siderStyles.position = 'fixed';
    siderStyles.top = 48;
    siderStyles.height = '100vh';
    siderStyles.zIndex = 999;
  }

  return (
    <>
      {fixed && (
        <div
          style={{
            transition: 'all 0.2s',
            width: siderCollapsed ? '80px' : '200px',
          }}
        />
      )}
      <Layout.Sider
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === 'clickTrigger') {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            style={{
              backgroundColor: token.colorBgElevated,
              borderRadius: 0,
              height: '100%',
              width: '100%',
            }}
          >
            {siderCollapsed ? (
              <RightOutlined
                style={{
                  color: token.colorPrimary,
                }}
              />
            ) : (
              <LeftOutlined
                style={{
                  color: token.colorPrimary,
                }}
              />
            )}
          </Button>
        }
      >
        <div
          style={{
            alignItems: 'center',
            backgroundColor: token.colorBgElevated,
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            fontSize: '14px',
            height: '64px',
            justifyContent: siderCollapsed ? 'center' : 'flex-start',
            padding: siderCollapsed ? '0' : '0 16px',
            width: siderCollapsed ? '80px' : '200px',
          }}
        >
          <RenderToTitle collapsed={siderCollapsed} />
        </div>
        {renderMenu()}
      </Layout.Sider>
    </>
  );
};
