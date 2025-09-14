import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SummaryRequest } from "../../ApiRequest/ApiRequest";

const Dashbord = () => {
  useEffect(() => {
    SummaryRequest();
  }, []);

  const SummaryList = useSelector((state) => state.summary.value);

  return (
    <div>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">Hey 👋</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your task management dashboard! Here you can create, track,
          and manage your tasks efficiently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {SummaryList.map((item, i) => (
    <div key={i} className="mt-6 p-6 bg-white rounded-lg shadow-blue-100">
      <h2 className="font-semibold text-2xl">Total: {item._id} task</h2>
      <p className="mt-5 text-3xl font-bold text-gray-500">{item.sum}</p>
    </div>
  ))}
</div>


      </main>
    </div>
  );
};

export default Dashbord;
