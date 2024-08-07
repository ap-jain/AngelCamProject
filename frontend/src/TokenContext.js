import React, { createContext, useState, useContext } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  const [cameraData, setCameraData] = useState(JSON.parse(localStorage.getItem('cameraData')) || {});

  const saveToken = (newToken, newUserData) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Save token in localStorage
    setUserData(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData)); // Save userData in localStorage
  };
  const saveCameraData = (newData)=>{
    setCameraData(newData);
    localStorage.setItem('cameraData', JSON.stringify(newData)); // 
  }

  const clearToken = () => {
    setToken('');
    setUserData({});
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('userData'); // Remove userData from localStorage
  };

  return (
    <TokenContext.Provider value={{ token, userData,cameraData, saveToken,saveCameraData, clearToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
