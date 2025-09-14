
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorToast, SuccessToast } from '../Utility/FrormUtility';
import { CreateTaskRequest } from '../../ApiRequest/ApiRequest';

const Create = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // do not set error messages into form state
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = String(formData.title || '').trim();
    const description = String(formData.description || '').trim();

    if (!title) {
      ErrorToast('Title is required');
      return;
    }
    if (!description) {
      ErrorToast('Description is required');
      return;
    }

    setSubmitting(true);
    try {
      const result = await CreateTaskRequest(title, description);
      if (result.success) {
        // success toast already shown by CreateTaskRequest, but keep navigation
        setFormData({ title: '', description: '' });
        navigate('/new');
      } else {
        // show the returned server message (do NOT write it into form state)
        ErrorToast(result.message || 'Unable to create task');
        console.debug("Create task failed server message:", result.message);
      }
    } catch (err) {
      console.error("Create submit unexpected error:", err);
      ErrorToast('Something went wrong while creating the task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 flex items-center justify-center px-4 py-8">
      <Toaster />
      <Transition show={true} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create Task</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter task title"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Describe the task"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-3 px-5 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </Transition>
    </div>
  );
};

export default Create;
