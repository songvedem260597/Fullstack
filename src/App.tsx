import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {PublicRoute,PrivateRoute} from './routes';
import {ProtectedRoute} from './services/authService';
import Default from './components/Layouts/Default';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/toastStyle.scss';
import './assets/scss/Global.scss';

import NotFound from './pages/404'; 


const App = () => {
  return (
    <Router>
       <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <Routes>
       {PublicRoute.map((route,index)=>{
          const Page    = route.component;
          const Layout  = route.layout;
          return <Route key={index} path={route.path} element={<Page/>} />
        })}
       {PrivateRoute.map((route, index) => {
          const Page    = route.component;
          const Layout  = route.layout  === false ? Fragment : Default;
          return <Route key={index} path={route.path} element={
          <ProtectedRoute route = {route.path}>
            <Layout>
              <Page/>
            </Layout>
          </ProtectedRoute>}/>
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
