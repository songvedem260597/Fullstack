import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import React, { useEffect } from 'react';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await API.post(`/logout`);
        navigate('/login'); 
      } catch (error) {
        navigate('/login'); 
      }
    };
    handleLogout();
  }, [navigate]);
  return null;
};

export default Logout;
