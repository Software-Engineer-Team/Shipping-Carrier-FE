import { useEffect } from 'react';

import { TOKEN_KEY } from '../../constants';
import { useSocket } from '../../contexts/socket';
import { AdminReport, CustomerReport } from './components';

export const Dashboard = () => {
  const role = localStorage.getItem('role') || 'customer';
  const socket = useSocket();
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      if (!socket?.connected) {
        socket?.connect();
      }
    }
  }, [socket]);
  if (role === 'customer') {
    return <CustomerReport />;
  } else {
    return <AdminReport />;
  }
};
