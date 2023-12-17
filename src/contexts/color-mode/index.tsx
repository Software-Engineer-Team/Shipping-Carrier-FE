import { RefineThemes } from '@refinedev/antd';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({} as ColorModeContextType);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const colorModeFromLocalStorage = localStorage.getItem('colorMode');
  const isSystemPreferenceDark = window?.matchMedia('(prefers-color-scheme: light)').matches;

  const systemPreference = isSystemPreferenceDark ? 'dark' : 'light';
  const [mode, setMode] = useState(colorModeFromLocalStorage || systemPreference);

  useEffect(() => {
    window.localStorage.setItem('colorMode', mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  dayjs.locale('vi');

  const { defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        setMode: setColorMode,
      }}
    >
      <ConfigProvider
        locale={viVN}
        theme={{
          ...RefineThemes.Red,
          algorithm: defaultAlgorithm,
          token: {
            borderRadius: 8,
            colorPrimary: 'e1293d',
            fontFamily: 'Noto Sans',
            fontSize: 12,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
