import { BankOutlined, FieldTimeOutlined, SettingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { AuthPage, notificationProvider } from '@refinedev/antd';
import { Action, Authenticated, CanAccess, IResourceItem, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerBindings, { CatchAllNavigate, DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from '@refinedev/react-router-v6';
import { Spin } from 'antd';
import { CustomFooter, CustomSider, Header, NotFoundComponent, ThemedTitleV2Custom } from 'components';
import dayjs from 'dayjs';
import { LoginPageCustom } from 'pages/authentication/login';
import { CustomerPricesList, CustomerPricesCreate, CustomerPricesEdit } from 'pages/customer-prices';
import { Dashboard } from 'pages/dashboard';
import { DeveloperList, DeveloperCreate, DeveloperEdit, DeveloperShow } from 'pages/developers';
import { MeEdit, MeList, MeShow } from 'pages/me';
import { OrdersList, OrdersCreate, OrdersEdit, OrdersShow } from 'pages/orders';
import { PriceSheetsList, PriceSheetsCreate, PriceSheetsEdit } from 'pages/price-sheets';
import { ReconciliationsList, ReconciliationsCreate, ReconciliationsEdit, ReconciliationsShow } from 'pages/reconciliations';
import { UsersCreate, UsersEdit, UsersList, UsersShow } from 'pages/users';
import { DataProvider } from 'providers/dataProvider';
import { axiosInstance } from 'providers/utilities';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { ThemedLayoutV2Custom } from './components/layout';
import { API_URL } from './constants';
import { ColorModeContextProvider } from './contexts/color-mode';
import { SocketProvider } from './contexts/socket';
import { AddressesCreate, AddressesEdit, AddressesList } from './pages/addresses';
import { BankAccountsCreate, BankAccountsEdit, BankAccountsList, BankAccountsShow } from './pages/bank-accounts';
import { ClientCreate, ClientEdit, ClientList } from './pages/clients';
import { ReconciliationOrderCreate, ReconciliationOrderEdit, ReconciliationOrderList, ReconciliationOrderShow } from './pages/reconciliation-orders';
import { ReportReconciliationsList } from './pages/report-reconciliations';
import { UploadOrdersCreate, UploadOrdersEdit, UploadOrdersList, UploadOrdersShow } from './pages/upload-orders';
import { accessControlProvider } from './providers/accessControlProvider';
import { authProvider } from './providers/authProvider';
import { locale } from './utils';

import '@refinedev/antd/dist/reset.css';
dayjs.locale(locale, undefined, true);

function App() {
  const { i18n, t } = useTranslation();

  const initAccount =
    process.env.NODE_ENV === 'production'
      ? {}
      : {
          initialValues: {
            email: 'customer@gmail.com',
            password: '123456',
          },
        };

  const i18nProvider = {
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
    translate: (key: string, params: object) => t(key, params),
  };

  const customTitleHandler = ({ resource }: { resource?: IResourceItem; action?: Action; params?: Record<string, string | undefined>; pathname?: string; autoGeneratedTitle: string }) => {
    let title = 'Bigsize Ship'; // Default title
    if (resource) {
      title = `${process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV + ' - '}${resource.meta?.label}`;
    }
    return title;
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <SocketProvider>
            <Refine
              authProvider={authProvider}
              dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              accessControlProvider={accessControlProvider}
              resources={[
                // User management
                {
                  meta: {
                    icon: <FieldTimeOutlined />,
                    label: 'Báo cáo',
                  },
                  name: 'report',
                },
                {
                  list: '/dashboard',
                  meta: {
                    label: 'Tổng quan',
                    parent: 'report',
                  },
                  name: 'dashboard',
                },
                {
                  create: '/report-reconciliations/create',
                  edit: '/report-reconciliations/edit/:id',
                  list: '/report-reconciliations',
                  meta: {
                    label: 'Báo cáo đối soát',
                    parent: 'report',
                  },
                  name: 'report-reconciliations',
                  show: '/report-reconciliations/show/:id',
                },
                {
                  meta: {
                    icon: <ShoppingCartOutlined />,
                    label: 'Vận chuyển',
                  },
                  name: 'order-management',
                },
                {
                  create: '/orders/create',
                  edit: '/orders/edit/:id',
                  list: '/orders',
                  meta: {
                    canDelete: true,
                    label: 'Quản lý đơn hàng',
                    parent: 'order-management',
                  },
                  name: 'orders',
                  show: '/orders/show/:id',
                },
                {
                  create: '/upload-orders/create',
                  edit: '/upload-orders/edit/:id',
                  list: '/upload-orders',
                  meta: {
                    canDelete: true,
                    label: 'Upload đơn hàng',
                    parent: 'order-management',
                  },
                  name: 'upload-orders',
                  show: '/upload-orders/show/:id',
                },
                {
                  create: '/reconciliations/create',
                  edit: '/reconciliations/edit/:id',
                  list: '/reconciliations',
                  meta: {
                    label: 'Đối soát',
                    parent: 'order-management',
                  },
                  name: 'reconciliations',
                  show: '/reconciliations/show/:id',
                },
                {
                  create: '/reconciliation-order/create',
                  edit: '/reconciliation-order/edit/:id',
                  list: '/reconciliation-order',
                  meta: {
                    label: 'Nhập đơn đối soát',
                    parent: 'order-management',
                  },
                  name: 'reconciliation-order',
                  show: '/reconciliation-order/show/:id',
                },
                {
                  meta: {
                    icon: <UserOutlined />,
                    label: 'Quản lý user',
                  },
                  name: 'user-management',
                },
                {
                  create: '/users/create',
                  edit: '/users/edit/:id',
                  list: '/users',
                  meta: {
                    canDelete: true,
                    label: 'Users',
                    parent: 'user-management',
                  },
                  name: 'users',
                  show: '/users/show/:id',
                },
                {
                  create: '/client/create',
                  edit: '/client/edit/:id',
                  list: '/client',
                  meta: {
                    canDelete: true,
                    label: 'Khách hàng',
                    parent: 'user-management',
                  },
                  name: 'client',
                },
                {
                  meta: {
                    icon: <BankOutlined />,
                    label: 'Tài chính',
                  },
                  name: 'finances',
                },
                {
                  create: '/bank-accounts/create',
                  edit: '/bank-accounts/edit/:id',
                  list: '/bank-accounts',
                  meta: {
                    canDelete: true,
                    label: 'Quản lý ngân hàng',
                    parent: 'finances',
                  },
                  name: 'bank-accounts',
                  show: '/bank-accounts/show/:id',
                },
                {
                  meta: {
                    icon: <SettingOutlined />,
                    label: 'Cấu hình',
                  },
                  name: 'settings',
                },
                {
                  create: '/price-sheets/create',
                  edit: '/price-sheets/edit/:id',
                  list: '/price-sheets',
                  meta: {
                    canDelete: true,
                    label: 'Bảng giá',
                    parent: 'settings',
                  },
                  name: 'price-sheets',
                  show: '/price-sheets/show/:id',
                },
                {
                  create: '/customer-prices/create',
                  edit: '/customer-prices/edit/:id',
                  list: '/customer-prices',
                  meta: {
                    canDelete: true,
                    label: 'Giá khách',
                    parent: 'settings',
                  },
                  name: 'customer-prices',
                  show: '/customer-prices/show/:id',
                },
                {
                  create: '/developer/create',
                  edit: '/developer/edit/:id',
                  list: '/developer',
                  meta: {
                    canDelete: true,
                    label: 'Developer',
                    parent: 'settings',
                  },
                  name: 'developer',
                  show: '/developer/show/:id',
                },
                {
                  edit: '/me/edit/:id',
                  list: '/me',
                  meta: {
                    canDelete: true,
                    label: 'Tài khoản',
                    parent: 'settings',
                  },
                  name: 'me',
                  show: '/me/show/:id',
                },
                {
                  create: '/addresses/create',
                  edit: '/addresses/edit/:id',
                  list: '/addresses',
                  meta: {
                    canDelete: true,
                    label: 'Kho hàng',
                    parent: 'settings',
                  },
                  name: 'addresses',
                },
              ]}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />} loading={<Spin />} v3LegacyAuthProviderCompatible>
                      <ThemedLayoutV2Custom Header={() => <Header sticky />} Sider={() => <CustomSider fixed={true} />} Footer={CustomFooter}>
                        <CanAccess>
                          <Outlet />
                        </CanAccess>
                      </ThemedLayoutV2Custom>
                    </Authenticated>
                  }
                >
                  <Route index element={<NavigateToResource resource="dashboard" />} />
                  <Route path="/users">
                    <Route index element={<UsersList />} />
                    <Route path="create" element={<UsersCreate />} />
                    <Route path="edit/:id" element={<UsersEdit />} />
                    <Route path="show/:id" element={<UsersShow />} />
                  </Route>
                  <Route path="/client">
                    <Route index element={<ClientList />} />
                    <Route path="create" element={<ClientCreate />} />
                    <Route path="edit/:id" element={<ClientEdit />} />
                  </Route>
                  <Route path="/price-sheets">
                    <Route index element={<PriceSheetsList />} />
                    <Route path="create" element={<PriceSheetsCreate />} />
                    <Route path="edit/:id" element={<PriceSheetsEdit />} />
                  </Route>
                  <Route path="/customer-prices">
                    <Route index element={<CustomerPricesList />} />
                    <Route path="create" element={<CustomerPricesCreate />} />
                    <Route path="edit/:id" element={<CustomerPricesEdit />} />
                  </Route>
                  <Route path="/orders">
                    <Route index element={<OrdersList />} />
                    <Route path="create" element={<OrdersCreate />} />
                    <Route path="edit/:id" element={<OrdersEdit />} />
                    <Route path="show/:id" element={<OrdersShow />} />
                  </Route>
                  <Route path="/bank-accounts">
                    <Route index element={<BankAccountsList />} />
                    <Route path="create" element={<BankAccountsCreate />} />
                    <Route path="edit/:id" element={<BankAccountsEdit />} />
                    <Route path="show/:id" element={<BankAccountsShow />} />
                  </Route>
                  <Route path="/upload-orders">
                    <Route index element={<UploadOrdersList />} />
                    <Route path="create" element={<UploadOrdersCreate />} />
                    <Route path="edit/:id" element={<UploadOrdersEdit />} />
                    <Route path="show/:id" element={<UploadOrdersShow />} />
                  </Route>
                  <Route path="/reconciliations">
                    <Route index element={<ReconciliationsList />} />
                    <Route path="create" element={<ReconciliationsCreate />} />
                    <Route path="edit/:id" element={<ReconciliationsEdit />} />
                    <Route path="show/:id" element={<ReconciliationsShow />} />
                  </Route>
                  <Route path="/report-reconciliations">
                    <Route index element={<ReportReconciliationsList />} />
                  </Route>
                  <Route path="/reconciliation-order">
                    <Route index element={<ReconciliationOrderList />} />
                    <Route path="create" element={<ReconciliationOrderCreate />} />
                    <Route path="edit/:id" element={<ReconciliationOrderEdit />} />
                    <Route path="show/:id" element={<ReconciliationOrderShow />} />
                  </Route>
                  <Route path="/developer">
                    <Route index element={<DeveloperList />} />
                    <Route path="create" element={<DeveloperCreate />} />
                    <Route path="edit/:id" element={<DeveloperEdit />} />
                    <Route path="show/:id" element={<DeveloperShow />} />
                  </Route>
                  <Route path="/me">
                    <Route index element={<MeList />} />
                    <Route path="edit/:id" element={<MeEdit />} />
                    <Route path="show/:id" element={<MeShow />} />
                  </Route>
                  <Route path="/addresses">
                    <Route index element={<AddressesList />} />
                    <Route path="create" element={<AddressesCreate />} />
                    <Route path="edit/:id" element={<AddressesEdit />} />
                  </Route>
                  <Route path="/dashboard">
                    <Route index element={<Dashboard />} />
                  </Route>
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={<LoginPageCustom title={<ThemedTitleV2Custom collapsed={false} title="Bigsize Ship Admin" subTitle="Bigsize Ship Admin" />} formProps={initAccount} />}
                  />
                  <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/dashboard" />} loading={<Spin />} v3LegacyAuthProviderCompatible>
                      <ThemedLayoutV2Custom Header={() => <Header sticky />} Sider={() => <CustomSider fixed={true} />} Footer={CustomFooter}>
                        <Outlet />
                      </ThemedLayoutV2Custom>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<NotFoundComponent />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
            </Refine>
          </SocketProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
