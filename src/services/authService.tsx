import {Navigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import API from './api';

interface ProtectedRouteProps{
  children: React.ReactNode;
  route: string;
}
