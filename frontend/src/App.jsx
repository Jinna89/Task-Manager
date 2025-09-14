
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Deshbord from "./pages/DeshbordPage";
import NewPage from "./pages/NewPage";
import CreatePage from "./pages/CreatePage";
import CompletedPage from "./pages/CompletedPage";
import InprogressPage from "./pages/InprogressPage";
import Cancel from "./pages/CancelPage";
import Login from "./pages/LoginPage";
import Registrations from "./pages/RegistrationPage";
import Page404 from "./pages/Page404";
import Forgetpass from "../src/pages/ForgetpassPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import ScreenLoader from "./components/layout/ScreenLoader";
import { getToken } from "./components/Utility/SessionUtility";

const App = () => {
  if (getToken()) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Deshbord />} />
            <Route path="/new" element={<NewPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/inprogress" element={<InprogressPage />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/profileupdate" element={<ProfileUpdatePage/>}></Route>
            <Route path="*" element={<Page404 />} /> {/* consistent */}
          </Routes>
        </BrowserRouter>
        <ScreenLoader />
      </>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/forgetpass" element={<Forgetpass />} />
            <Route path="*" element={<Page404 />} /> {/* consistent */}
          </Routes>
        </BrowserRouter>
        <ScreenLoader />
      </>
    );
  }
};

export default App;