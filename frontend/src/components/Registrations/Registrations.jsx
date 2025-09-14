import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RegistrationRequest } from '../../ApiRequest/ApiRequest';
import { ErrorToast, IsEmailValid, IsEmpty, IsMobileValid, SuccessToast } from '../Utility/FrormUtility';

const Registrations = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    photo: 'data:image/jpeg;base64,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',});

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if(IsEmpty(formData.name)){
      ErrorToast("Name Required");
      return;
    }
    else if(IsEmpty(formData.email)){
      ErrorToast("Email Required");
      return;
    }
    else if(!IsEmailValid(formData.email)){
      ErrorToast("Invalid Email Address");
      return;
    }
    else if(IsEmpty(formData.phone)){
      ErrorToast("Phone Number Required");
      return;
    }
    else if(IsMobileValid(formData.phone)){
      ErrorToast("Invalid Phone Number");
      return;
    }
    else if(IsEmpty(formData.password)){
      ErrorToast("Password Required");
      return;
    }else{
      const result = await RegistrationRequest(
        formData.email,
        formData.name,
        formData.phone,
        formData.password,
        formData.photo
      );

      if (result === true) {
        SuccessToast("Registration successful!");
        // Optionally clear form or redirect here
        navigate('/login');
      }
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-100  flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+8801XXXXXXXXX"
             
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to='/login' className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default Registrations;
