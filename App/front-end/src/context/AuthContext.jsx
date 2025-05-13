import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users/me', { withCredentials: true });

        if (!res) {
          throw new Error('Invalid response from fetch user!');
        };

        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
      finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const removeToken = async () => {
    try {
      await axios.post('http://localhost:3001/api/users/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, removeToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
