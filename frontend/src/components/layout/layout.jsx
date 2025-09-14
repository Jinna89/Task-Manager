import React from 'react';
import { Disclosure } from '@headlessui/react';
import {
  ChevronUpIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  FolderIcon,
  Cog6ToothIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { removeUserDetails } from '../Utility/SessionUtility';


const Layout = (props) => {
  const onLogOut = () => {
    removeUserDetails();
  }
  return (
    
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-lg">
        <div className="p-4 text-2xl font-bold flex justify-center items-center md:justify-center md:items-center gap-2 border-b border-indigo-500">
          <AcademicCapIcon className="h-6 w-6 text-white" /> Task Manager
        </div>
        <nav className="p-4 space-y-2">
          {/* Static link */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-500 transition"
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Collapsible: Projects */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-500 transition">
                  <div className="flex items-center gap-3">
                    <FolderIcon className="h-5 w-5" />
                    Task
                  </div>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 transition`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="space-y-1 pl-10 mt-1">
                  {/* Your new nav items */}
                  <Link to="/create" className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <PlusCircleIcon className="h-4 w-4" /> Create New
                  </Link>
                  <Link to="/new" className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <ClipboardDocumentListIcon className="h-4 w-4" /> New Task
                  </Link>
                  <Link to="/inprogress" className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <ArrowPathIcon className="h-4 w-4" /> In Progress
                  </Link>
                  <Link to="/completed" className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <CheckCircleIcon className="h-4 w-4" /> Completed
                  </Link>
                  <Link to="/cancel" className="flex items-center gap-2 py-1 text-sm hover:underline">
                    <XCircleIcon className="h-4 w-4" /> Canceled
                  </Link>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>

          {/* Collapsible: Settings */}
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-500 transition">
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </div>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 transition`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="space-y-1 pl-10 mt-1">
                  <Link to="/profile" className="block py-1 text-sm cursor-pointer rounded-md px-3 hover:bg-indigo-500 transition">
                    Profile
                  </Link>
                  <a onClick={onLogOut} className="block py-1 text-sm rounded-md px-3 hover:bg-indigo-500 transition">
                    Log Out
                  </a>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
      {props.children}
      </main>
    </div>
  );
};

export default Layout;