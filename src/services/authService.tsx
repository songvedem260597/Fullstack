import {Navigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import API from './api';

interface ProtectedRouteProps{
  children: React.ReactNode;
  route: string;
}

export const login = async (email: string, password: string) => {
  try{
    const response = await API.post(`/login`, { email, password });
    return true;
  } catch(error: any){
    if (error.response && error.response.status === 401) {
      return false; 
    } else {
      return false;
    }
  }
};
export const registerUser = async (data: { name: string, email: string, password: string, password_confirmation: string }) => {
  try {
    await API.post(`/register`, data);
  } catch (error: any) {
    throw new Error('Đăng ký thất bại');
  }
};
export const logout = async () => {
  try {
    await API.post(`/logout`);
  } catch (error: any) {
    throw new Error('Logout failed');
  }
};
export const ProtectedRoute = ({ children,route }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const checkAuth = async () => {
        try {
          const response = await API.get(route);
          console.log(response.data.error)
          if (response.status === 200 && response.data. error === undefined) {
            setIsAuthenticated(true);
          } else{
            setIsAuthenticated(false);
          }
        } catch (error:any) {
            setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
    };
    checkAuth();
  }, [route]);
  if (loading) {
    return <LoadingComponent message="Please wait while we verify your access..." />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};