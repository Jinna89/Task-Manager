import React from 'react';
import { useSelector } from 'react-redux';

const ScreenLoader = () => {
  // select the loader string from the correct slice
  const loaderClass = useSelector((state) => state.settings?.loader ?? 'hidden');

  return (
    <div className={`${loaderClass} fixed inset-0 z-50 flex items-center justify-center bg-white/70`}>
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 overflow-hidden">
        <div className="progress-anim h-full bg-blue-600 rounded-r-full" style={{ width: '40%' }} />
      </div>

      <style>{`
        @keyframes progress {
          0%   { transform: translateX(-100%); width: 30%; }
          50%  { transform: translateX(25%);  width: 60%; }
          100% { transform: translateX(200%); width: 30%; }
        }
        .progress-anim {
          animation: progress 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScreenLoader;