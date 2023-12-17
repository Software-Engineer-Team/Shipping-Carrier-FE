import { message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { API_URL, TOKEN_KEY } from '../../constants';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: React.ReactNode;
}
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = (token: string) => {
    const newSocket = io(API_URL, {
      auth: {
        token: token,
      },
      autoConnect: false,
      reconnectionDelayMax: 3000,
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      messageApi?.open({
        content: `Kết nối thành công`,
        type: 'success',
      });
    });

    // newSocket.on("disconnect", (reason) => {
    //   messageApi?.open({
    //     type: "error",
    //     content: `Mất kết nối`,
    //   });
    // });

    setSocket(newSocket);
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      connectSocket(token);
    }
    return () => {
      if (socket) {
        socket.disconnect(); // Disconnect the socket on unmount
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.connect(); // Connect socket when component mounts
    }
  }, [socket]);

  // Listen for network status changes
  useEffect(() => {
    const handleOnline = () => {
      if (socket && !socket.connected) {
        socket.connect(); // Reconnect if online and not connected
      }
    };

    const handleOffline = () => {
      if (socket && socket.connected) {
        socket.disconnect(); // Disconnect if offline and currently connected
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [socket]);

  return (
    <>
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
      {contextHolder}
    </>
  );
};
