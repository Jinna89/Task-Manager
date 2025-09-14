import React, { useEffect, useState } from 'react';
import { ProfileRequest } from '../../ApiRequest/ApiRequest';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ProfileUpdatePage from '../../pages/ProfileUpdatePage';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    photo: '',
    role: 'User',
  });

  useEffect(() => {
    async function fetchProfile() {
      const data = await ProfileRequest();
      if (data) {
        setUser({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          photo: data.photo,
          role: 'User', // or use data.role if available
        });
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.photo || 'https://avatars.githubusercontent.com/u/139199762?v=4'}
            alt="Profile"
            className="w-50 h-50 rounded-full object-cover border-4 border-indigo-500"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4"
              />
            </svg>
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h2a2 2 0 012 2v0a2 2 0 01-2 2H3v10a2 2 0 002 2h14a2 2 0 002-2V9h-2a2 2 0 01-2-2v0a2 2 0 012-2h2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span>{user.mobile}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            <Link to="/profileupdate">Edit Profile</Link>
            
          </button>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default Profile;
