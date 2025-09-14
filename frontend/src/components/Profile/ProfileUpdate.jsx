import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileRequest, ProfileUpdateRequest } from '../../ApiRequest/ApiRequest';
import { Toaster } from 'react-hot-toast';
import { ImageToBase64, ErrorToast } from '../Utility/FrormUtility';

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    photo: '',
  });

  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const user = await ProfileRequest();
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          photo: user.photo,
        });

        const raw = user.photo || '';
        setPreview(
          raw.startsWith('data:image')
            ? raw
            : raw.length > 100
            ? `data:image/jpeg;base64,${raw}`
            : 'https://i.pravatar.cc/150?img=3'
        );
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    try {
      const base64 = await ImageToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
      setPreview(base64);
    } catch (err) {
      ErrorToast(err);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    try {
      const base64 = await ImageToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
      setPreview(base64);
    } catch (err) {
      ErrorToast(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await ProfileUpdateRequest(
      formData.name,
      formData.email,
      formData.mobile,
      formData.photo
    );
    if (result.success) {
      navigate('/profile'); // ✅ Redirect after update
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Update Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div
              className="relative w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden cursor-pointer hover:opacity-90 transition"
              onClick={() => fileInputRef.current.click()}
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-sm font-medium">
                Change Photo
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            disabled // 🚫 Prevent editing
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            disabled // 🚫 Prevent editing
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Save Changes
          </button>
        </form>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default ProfileUpdate;
