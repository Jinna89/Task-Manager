import Swal from "sweetalert2";
import { DeleteTaskRequest } from "../../ApiRequest/ApiRequest";

export function DeleteTodo(id) {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      return DeleteTaskRequest(id);
    }
    return false; // Return something to avoid undefined
  });
}
