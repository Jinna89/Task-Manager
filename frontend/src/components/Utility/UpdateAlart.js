import Swal from "sweetalert2";
import { UpdateTaskRequest } from "../../ApiRequest/ApiRequest"

export function UpdateTodo(id, status) {
  return Swal.fire({
    title: 'Change Status',
    input: 'select',
    inputOptions: {
      New: 'New',
      Completed: 'Completed',
      Progress: 'Progress',
      Cenceled: 'Cenceled'
    },
    inputValue: status,
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      return UpdateTaskRequest(id, result.value).then((res) => {
        if (res === true) {
          Swal.fire('Status Changed', 'Task status updated successfully', 'success');
          return true;
        } else {
          Swal.fire('Error', 'Failed to update task status', 'error');
          return false;
        }
      });
    }
    return false;
  });
}
