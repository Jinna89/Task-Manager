import React, { useEffect, useMemo } from "react";
import { MapIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TaskListByStatus } from "../../ApiRequest/ApiRequest";
import { useSelector } from "react-redux";
import { DeleteTodo } from "../Utility/DeleteAlart";
import { UpdateTodo } from "../Utility/UpdateAlart";

const Progress = () => {
  useEffect(() => {
    TaskListByStatus("Progress"); // ✅ Match backend status
  }, []);

  const rawProgressList = useSelector((state) => state.task.inprogress);
  const ProgressList = useMemo(() => rawProgressList || [], [rawProgressList]);
  console.log("Progress:", ProgressList);

  const DeleteItem = (id) => {
    DeleteTodo(id).then((result) => {
      if (result === true) {
        TaskListByStatus("Progress");
      }
    });
  };

  const StatusChangeItem = (id, status) => {
    UpdateTodo(id, status).then((result) => {
      if (result === true) {
        TaskListByStatus("Progress");
      }
    });
  };

  return (
    <div>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">Progress Task</h1>
        <p className="mt-2 text-gray-600">See your Progress Task.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ProgressList.map((item, index) => (
            <div
              key={index}
              className="mt-6 p-6 bg-white rounded-lg shadow-blue-100"
            >
              <h2 className="text-cyan-950">{item.title}</h2>
              <p className="mt-4 text-gray-600 text-justify">
                {item.description}
              </p>
              <div className="mt-4 flex justify-between items-center gap-1 text-sm text-gray-500">
                <p className="flex items-center gap-1">
                  <MapIcon className="h-4 w-4" />
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <PencilIcon
                    onClick={() => StatusChangeItem(item._id, item.status)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </p>
                <p>
                  <TrashIcon
                    onClick={() => DeleteItem(item._id)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </p>
                <p className="bg-purple-500 rounded-2xl px-2 py-1.5 text-white">
                  {item.status || "unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Progress;
