import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null); // ✅ Задаване на начален `null`

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('token'));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const setToken = (userData) => {
    localStorage.setItem('token', JSON.stringify(userData));
    setUser(userData);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook за използване на контекста
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
