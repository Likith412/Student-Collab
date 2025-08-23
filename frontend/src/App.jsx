import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
// import ClipLoader from "react-spinners/ClipLoader";
// import { ToastContainer } from "react-toastify";

// import ProtectedRoutes from "./components/ProtectedRoutes";
// import Navbar from "./components/Navbar";
import Index from "./components/pages/Index";
import Discover from "./components/pages/Discover";
import NotFound from "./components/pages/NotFound";
import ProjectDetails from "./components/pages/ProjectDetails";
import ProjectCreate from "./components/ProjectCreate";
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import AddBlog from "./components/AddBlog";
// import EditBlog from "./components/EditBlog";
// import FailureView from "./components/FailureView";
import UserContext from "./contexts/UserContext";
// import BlogItemDetails from "./components/BlogItemDetails";

// import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [user, setUser] = useState({ _id: "", username: "", email: "", role: "" });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.success);

  const jwtToken = Cookies.get("jwtToken");

  const getUser = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch("/api/protected", {
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
    // getUser();
  }, []);

  const renderSuccessView = () => {
    return (
      <>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            {/* <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs/:blogId" element={<BlogItemDetails />} />
            <Route element={<ProtectedRoutes />}>
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blogs/edit/:blogId" element={<EditBlog />} />
            </Route> */}
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
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
