import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmailVerifyRequest,
  CodeVerifyRequest,
  ResetPasswordRequest,
} from '../../ApiRequest/ApiRequest';
import { Toaster } from 'react-hot-toast';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const success = await EmailVerifyRequest(email);
    if (success) setStep(2);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const success = await CodeVerifyRequest(email, code);
    if (success) setStep(3);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const success = await ResetPasswordRequest(email, password, code);
    if (success) navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP code"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default ForgetPassword;
