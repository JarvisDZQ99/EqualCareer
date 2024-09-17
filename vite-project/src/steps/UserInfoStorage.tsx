import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  gender: string;
  industry: string;
  region: string;
}

interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

interface UserInfoProviderProps {
  children: ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const savedInfo = localStorage.getItem('userInfo');
    return savedInfo ? JSON.parse(savedInfo) : { gender: '', industry: '', region: '' };
  });

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = React.useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
};