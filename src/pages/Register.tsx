import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import logoRegister from '../assets/images/register.gif';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {

  const { register, handleSubmit, formState: { errors },getValues } = useForm<RegisterFormInputs>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/login'); 
    } catch (error) {
      console.error(error);
      alert('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-blue-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img src={logoRegister} alt="" className="w-full h-full object-cover"/>
      </div>
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Register your account</h1>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input type="name" id="name" placeholder="Enter Name" 
              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              {...register('name', { required: 'Name is required' })}
                />
              {errors.name && <p className='mt-2 text-red-500 text-sm'>{errors.name.message}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Email Address</label>
              <input type="email" id="email" placeholder="Enter Email Address" 
              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className='mt-2 text-red-500 text-sm'>{errors.email.message}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input type="password" id="password" placeholder="Enter Password" minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              {...register('password', { required: 'Password is required'})}
              />
               {errors.password && <p className='mt-2 text-red-500 text-sm'>{errors.password.message}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input type="password" id="password_confirmation" placeholder="Enter password confirmation" minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              {...register('password_confirmation', { required: 'Password confirmation is required', validate:(value)=> value === getValues('password') || 'Passwords do not match'})}
              />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-2">{errors.password_confirmation.message}</p>
                )}
            </div>
            <button disabled={loading} type="submit" className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6">{loading ? 'Registering...' : 'Register'}</button>
          </form>
          <p className="text-sm text-gray-500 mt-12">&copy; {new Date().getFullYear()} Dashboard - All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
