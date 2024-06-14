'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  // const refreshToken = localStorage.getItem('refresh') 
  // console.log(refreshToken)

  useEffect(() => {
    const HeartBeat = async () => {
      try {
        const response = await axios.post('api/auth/refresh-token', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh')}`
          },
          withCredentials: true
        });
        // console.log(response)
        if (!response) {
          setIsAuthenticated(false);
          router.push('/login');
        } else {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refresh', response.data.refreshToken);
        }
      } catch (error) {
        console.log("error during heartbeat: ", error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    const intervalId = setInterval(HeartBeat, 900000);

    return () => clearInterval(intervalId);
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
