import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('healthinsight_user');
    const storedToken = localStorage.getItem('healthinsight_token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    localStorage.setItem('healthinsight_user', JSON.stringify(userData));

    const authToken = userToken || (userData && userData.token);
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('healthinsight_token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('healthinsight_user');
    localStorage.removeItem('healthinsight_token');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('healthinsight_user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

