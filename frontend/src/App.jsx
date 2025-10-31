import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Index from "./components/pages/Index";
import Discover from "./components/pages/Discover";
import NotFound from "./components/pages/NotFound";
import ProjectDetails from "./components/pages/ProjectDetails";
import ProjectCreate from "./components/ProjectCreate";
import Projects from "./components/pages/Projects";
import Profile from "./components/pages/Profile";
import Register from "./components/Register";
import Login from "./components/Login";
import UserContext from "./contexts/UserContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { Toaster } from "./components/ui/toaster";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [user, setUser] = useState({ _id: "", username: "", email: "", role: "" });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const getUser = async () => {
    const jwtToken = Cookies.get("jwtToken");
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`${API_URL}/api/protected`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtToken,
          "Content-Type": "application/json",
        },
      });

      const { user } = await response.json();

      if (response.ok) {
        setUser(user);
      } else {
        setUser(null);
      }
      setApiStatus(apiStatusConstants.success);
    } catch (e) {
      console.log(e);
      setApiStatus(apiStatusConstants.failure);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderSuccessView = () => {
    return (
      <>
        <UserContext.Provider value={{ user, setUser }}>
          <ApplicationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/not-found" element={<NotFound />} />

              {/* All Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/projects/create" element={<ProjectCreate />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                <Route path="/projects" element={<Projects />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
            <Toaster />
          </ApplicationProvider>
        </UserContext.Provider>
      </>
    );
  };

  const renderFailureView = () => {
    return <div>Failure View</div>;
  };

  const renderLoadingView = () => {
    return <div>Loading</div>;
  };

  switch (apiStatus) {
    case apiStatusConstants.success:
      return renderSuccessView();
    case apiStatusConstants.failure:
      return renderFailureView();
    case apiStatusConstants.inProgress:
      return renderLoadingView();
    default:
      return null;
  }
}

export default App;
