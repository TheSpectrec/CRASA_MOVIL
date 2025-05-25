import React, { createContext, useContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

const TabBarContext = createContext();

export const TabBarProvider = ({ children }) => {
  // Shared value to control tab bar visibility (1 = visible, 0 = hidden)
  const tabBarVisibility = useSharedValue(1);

  return (
    <TabBarContext.Provider
      value={{
        tabBarVisibility,
      }}
    >
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);
