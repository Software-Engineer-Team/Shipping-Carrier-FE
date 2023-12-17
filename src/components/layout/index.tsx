import { ThemedLayoutContextProvider } from '@refinedev/antd';
import { Grid, Layout as AntdLayout } from 'antd';
import React from 'react';

import { ThemedHeaderV2 as DefaultHeader } from './header';
import { ThemedSiderV2 as DefaultSider } from './sider';
import { RefineThemedLayoutV2Props } from './types';

export const ThemedLayoutV2Custom: React.FC<RefineThemedLayoutV2Props> = ({ children, Footer, Header, initialSiderCollapsed, OffLayoutArea, Sider, Title }) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const isSmall = typeof breakpoint.sm === 'undefined' ? true : breakpoint.sm;

  return (
    <ThemedLayoutContextProvider initialSiderCollapsed={initialSiderCollapsed}>
      <AntdLayout style={{ minHeight: '100vh' }}>
        <HeaderToRender />
        <AntdLayout hasSider>
          <SiderToRender Title={Title} />
          <AntdLayout.Content>
            <div
              style={{
                minHeight: 360,
                padding: isSmall ? 24 : 12,
              }}
            >
              {children}
            </div>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
        </AntdLayout>
        {Footer && <Footer />}
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
