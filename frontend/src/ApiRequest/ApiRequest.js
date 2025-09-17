import axios from "axios";
import { ErrorToast, SuccessToast } from "../components/Utility/FrormUtility";
import { showLoader, hideLoader } from "../redux/stage-slice/SettingsSlice";
import store from "../redux/Store/Store";
import {
  setToken,
  setUserDetails,
  getToken,
} from "../components/Utility/SessionUtility";

import {
  setNewTasks,
  setInProgressTasks,
  setCompletedTasks,
  setCanceledTasks,
} from "/src/redux/task-slice/taskSlice.js";
import { setSummary } from "../redux/stage-slice/summary-slice.js";

const BaseURL = "https://task-manager-ieqj.onrender.com/api/";

// helper to decode JWT safely
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}

export function LoginRequest(email, password) {
  store.dispatch(showLoader());
  const URL = BaseURL + "Login";
  const Body = {
    email: String(email || "").trim(),
    password: String(password || ""),
  };

  return axios
    .post(URL, Body)
    .then((res) => {
      store.dispatch(hideLoader());
      console.debug("LoginRequest response:", res?.data);

      if (res.status === 200) {
        if (res.data.status === "fail" || res.data.status === "failed") {
          ErrorToast(res.data.message || "Login failed");
          return false;
        } else {
          // try multiple possible token locations returned by backend
          const token =
            res.data.token ||
            res.data.data?.token ||
            res.data.result?.token ||
            res.data.accessToken;
          if (token) {
            setToken(token);
            // set axios default header for subsequent requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.defaults.headers.common["x-access-token"] = token;
            axios.defaults.headers.common["token"] = token;
            console.debug("Saved token and set axios default headers");
          } else {
            console.warn(
              "LoginResponse did not include token at expected locations:",
              res.data
            );
          }

          if (res.data.user) setUserDetails(res.data.user);
          SuccessToast(res.data.message || "Login successful!");
          return true;
        }
      } else {
        ErrorToast("Something Went Wrong");
        return false;
      }
    })
    .catch((err) => {
      store.dispatch(hideLoader());
      console.error("LoginRequest error:", err?.response || err);
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        ErrorToast(serverMsg);
      } else {
        ErrorToast("Network or server error");
      }
      return false;
    });
}

export function RegistrationRequest(email, name, phone, password, photo = '') {
  store.dispatch(showLoader());

  const URL = BaseURL + 'Registration';

  const Body = {
    email: String(email || '').trim(),
    name: String(name || '').trim(),
    phone: String(phone || '').replace(/\D/g, '').startsWith('0')
      ? '88' + String(phone || '').replace(/\D/g, '')
      : String(phone || '').replace(/\D/g, ''),
    password: String(password || ''),
    photo,
  };

  return axios
    .post(URL, Body)
    .then((res) => {
      store.dispatch(hideLoader());

      if (res.status === 200) {
        if (res.data.status === 'fail' || res.data.status === 'failed') {
          const msg = res.data.message || '';
          const indexMatch = msg.match(/index:\s*([a-zA-Z0-9_]+)_1/);
          const dupFieldFromIndex = indexMatch ? indexMatch[1] : null;

          const dupKeyMatch = msg.match(
            /dup key:\s*\{\s*("?)(email|mobile|phone)\1\s*:/i
          );
          const dupField =
            dupFieldFromIndex ||
            (dupKeyMatch ? dupKeyMatch[2].toLowerCase() : null);

          if (dupField === 'email') {
            ErrorToast('Email already exists!');
          } else if (dupField === 'mobile' || dupField === 'phone') {
            ErrorToast('Mobile number already exists!');
          } else if (msg.toLowerCase().includes('duplicate key error')) {
            ErrorToast('Duplicate entry!');
          } else {
            ErrorToast(msg || 'Registration failed');
          }
          return false;
        } else {
          return true;
        }
      } else {
        ErrorToast('Something Went Wrong');
        return false;
      }
    })
    .catch((err) => {
      store.dispatch(hideLoader());
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        ErrorToast(serverMsg);
      } else {
        ErrorToast('Network or server error');
      }
      return false;
    });
}

export async function CreateTaskRequest(title, description) {
  store.dispatch(showLoader());
  const URL = BaseURL + "CreateTask";

  // ensure required fields for backend (add status default)
  const Body = {
    title: String(title || "").trim(),
    description: String(description || "").trim(),
    status: "New"
  };

  const token = getToken();
  if (!token) {
    store.dispatch(hideLoader());
    return { success: false, message: "Unauthorized. Please login." };
  }

  // try decode user id from token if backend expects it (optional)
  const decoded = decodeJwt(token);
  const user_id = decoded?.user_id || decoded?.userId || decoded?.id || null;
  const headers = {
    Authorization: `Bearer ${token}`,
    "x-access-token": token,
    token: token,
  };
  if (user_id) headers["user_id"] = user_id;

  try {
    const res = await axios.post(URL, Body, { headers });
    store.dispatch(hideLoader());
    const data = res?.data || {};

    if (
      res.status === 200 &&
      !(data.status === "fail" || data.status === "failed")
    ) {
      SuccessToast(data.message || "Task created successfully!");
      return { success: true, data };
    }

    // return server message for caller to show
    return { success: false, message: data.message || "Task creation failed" };
  } catch (err) {
    store.dispatch(hideLoader());
    console.error("CreateTaskRequest error:", err?.response || err);
    const serverMsg =
      err?.response?.data?.message || err?.response?.data || err.message;
    if (err?.response?.status === 401)
      return { success: false, message: "Unauthorized. Please login." };
    return {
      success: false,
      message: String(serverMsg) || "Network or server error",
    };
  }
}

export async function TaskListByStatus(status) {
  store.dispatch(showLoader());

  const URL = `${BaseURL}TaskListByStatus/${status}`;

  try {
    const res = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-access-token": getToken(),
        token: getToken(),
      },
    });

    store.dispatch(hideLoader());

    const taskArray = res.data.task || [];

    switch (status) {
      case "New":
        store.dispatch(setNewTasks(taskArray));
        break;
      case "Progress":
        store.dispatch(setInProgressTasks(taskArray));
        break;
      case "Completed":
        store.dispatch(setCompletedTasks(taskArray));
        break;
      case "Canceled":
      case "Cenceled":
        store.dispatch(setCanceledTasks(taskArray));
        break;
      default:
        ErrorToast("Invalid status provided");
    }
  } catch (err) {
    store.dispatch(hideLoader());
    console.error("TaskListByStatus error:", err?.response || err);
    const serverMsg = err?.response?.data?.message;
    ErrorToast(serverMsg || "Network or server error");
  }
}

export async function SummaryRequest() {
  store.dispatch(showLoader());
  const URL = BaseURL + "CountTask";

  try {
    const res = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-access-token": getToken(),
        token: getToken(),
      },
    });

    store.dispatch(hideLoader());

    if (res.status === 200) {
      const summaryData = res.data.count || []; // ✅ FIXED
      store.dispatch(setSummary(summaryData));
    } else {
      ErrorToast("Something Went Wrong");
    }
  } catch (err) {
    store.dispatch(hideLoader());
    ErrorToast("Network or server error");
    console.error("SummaryRequest error:", err?.response || err);
  }
}

export function DeleteTaskRequest(id) {
  store.dispatch(showLoader());
  const URL = BaseURL + "DeleteTask/" + id;
  
  return axios.delete(URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "x-access-token": getToken(),
      token: getToken(),
    },
  })
  .then((res) => {
    store.dispatch(hideLoader());
    if (res.status === 200) {
      if (res.data.status === "fail" || res.data.status === "failed") {
        ErrorToast(res.data.message || "Delete failed");
        return false;
      } else {
        SuccessToast(res.data.message || "Delete successful!");
        return true;
      }
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  })
  .catch((err) => {
    store.dispatch(hideLoader());
    const serverMsg = err?.response?.data?.message;
    if (serverMsg) {
      ErrorToast(serverMsg);
    } else {
      ErrorToast("Network or server error");
    }
    return false;
  });
}

export function UpdateTaskRequest(id, status) {
  store.dispatch(showLoader());
  const URL = BaseURL + "UpdateTaskStatus/" + id + "/" + status;
  
  return axios.put(URL, {}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "x-access-token": getToken(),
      token: getToken(),
    },
  })
  .then((res) => {
    store.dispatch(hideLoader());
    if (res.status === 200) {
      if (res.data.status === "fail" || res.data.status === "failed") {
        ErrorToast(res.data.message || "Update failed");
        return false;
      } else {
        SuccessToast(res.data.message || "Update successful!");
        return true;
      }
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  })
  .catch((err) => {
    store.dispatch(hideLoader());
    const serverMsg = err?.response?.data?.message;
    if (serverMsg) {
      ErrorToast(serverMsg);
    } else {
      ErrorToast("Network or server error");
    }
    return false;
  });
}

export async function ProfileRequest() {
  store.dispatch(showLoader());
  const URL = BaseURL + "ProfileDetails";

  const token = getToken();
  if (!token) {
    store.dispatch(hideLoader());
    ErrorToast("Unauthorized. Please login.");
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "x-access-token": token,
    token: token,
  };

  try {
    const res = await axios.get(URL, { headers });
    store.dispatch(hideLoader());

    if (res.status === 200 && res.data.status === "success") {
      const user = res.data.userDetails;
      if (user) {
        setUserDetails(user); // optional: store in session
        return user;
      } else {
        ErrorToast("User data not found");
        return null;
      }
    } else {
      ErrorToast(res.data.message || "Failed to fetch profile");
      return null;
    }
  } catch (err) {
    store.dispatch(hideLoader());
    console.error("ProfileRequest error:", err?.response || err);
    const serverMsg =
      err?.response?.data?.message || err?.response?.data || err.message;
    if (err?.response?.status === 401) {
      ErrorToast("Unauthorized. Please login.");
      return null;
    }
    ErrorToast(String(serverMsg) || "Network or server error");
    return null;
  }
}

export async function ProfileUpdateRequest(name, email, mobile, photo = '') {
  store.dispatch(showLoader());
  const URL = BaseURL + "UpdateProfile";

  const token = getToken();
  if (!token) {
    store.dispatch(hideLoader());
    ErrorToast("Unauthorized. Please login.");
    return { success: false };
  }

  const Body = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    mobile: String(mobile || '').replace(/\D/g, '').startsWith('0')
      ? '88' + String(mobile || '').replace(/\D/g, '')
      : String(mobile || '').replace(/\D/g, ''),
    photo,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "x-access-token": token,
    token: token,
  };

  try {
    const res = await axios.put(URL, Body, { headers });
    store.dispatch(hideLoader());

    if (res.status === 200 && res.data.status === "success") {
      setUserDetails(res.data.userDetails); // update local session
      SuccessToast(res.data.message || "Profile updated successfully!");
      return { success: true };
    } else {
      ErrorToast(res.data.message || "Profile update failed");
      return { success: false };
    }
  } catch (err) {
    store.dispatch(hideLoader());
    const serverMsg =
      err?.response?.data?.message || err?.response?.data || err.message;
    if (err?.response?.status === 401) {
      ErrorToast("Unauthorized. Please login.");
      return { success: false };
    }
    ErrorToast(String(serverMsg) || "Network or server error");
    return { success: false };
  }
}

export async function EmailVerifyRequest(email) {
  store.dispatch(showLoader());
  const URL = BaseURL + `EmailVerify/${email}`;

  try {
    const res = await axios.get(URL);
    store.dispatch(hideLoader());
    if (res.data.status === 'Success') {
      SuccessToast(res.data.Message);
      return true;
    } else {
      ErrorToast(res.data.message);
      return false;
    }
  } catch (err) {
    store.dispatch(hideLoader());
    ErrorToast(err?.response?.data?.message || 'Network error');
    return false;
  }
}

export async function CodeVerifyRequest(email, code) {
  store.dispatch(showLoader());
  const URL = BaseURL + `CodeVerify/${email}/${code}`;

  try {
    const res = await axios.get(URL);
    store.dispatch(hideLoader());
    if (res.data.status === 'Success') {
      SuccessToast(res.data.Message);
      return true;
    } else {
      ErrorToast(res.data.message);
      return false;
    }
  } catch (err) {
    store.dispatch(hideLoader());
    ErrorToast(err?.response?.data?.message || 'Network error');
    return false;
  }
}

export async function ResetPasswordRequest(email, password, code) {
  store.dispatch(showLoader());
  const URL = BaseURL + 'ResetPassword';
  const Body = { email, password, code };

  try {
    const res = await axios.put(URL, Body);
    store.dispatch(hideLoader());
    if (res.data.status === 'Success') {
      SuccessToast(res.data.Message);
      return true;
    } else {
      ErrorToast(res.data.message);
      return false;
    }
  } catch (err) {
    store.dispatch(hideLoader());
    ErrorToast(err?.response?.data?.message || 'Network error');
    return false;
  }
}




