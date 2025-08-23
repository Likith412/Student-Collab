import React, { createContext, useContext, useState } from "react";

const ApplicationContext = createContext(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([
    // Mock data for demonstration
    {
      id: "1",
      projectId: "1",
      projectTitle: "AI-Powered Study Buddy",
      projectCreator: "Sarah Chen",
      applicantName: "Alex Johnson",
      applicantId: "alex-johnson",
      status: "pending",
      appliedAt: "2024-01-15T10:30:00Z",
      message: "I have experience in ML and would love to contribute to this project!",
    },
    {
      id: "2",
      projectId: "2",
      projectTitle: "Campus Event Platform",
      projectCreator: "Mike Rodriguez",
      applicantName: "Alex Johnson",
      applicantId: "alex-johnson",
      status: "accepted",
      appliedAt: "2024-01-10T14:20:00Z",
      message: "Excited to work on the frontend components!",
    },
    {
      id: "3",
      projectId: "3",
      projectTitle: "Student Portfolio Builder",
      projectCreator: "Emma Davis",
      applicantName: "Alex Johnson",
      applicantId: "alex-johnson",
      status: "rejected",
      appliedAt: "2024-01-05T09:15:00Z",
    },
  ]);

  const applyToProject = (projectId, projectTitle, projectCreator, message) => {
    const newApplication = {
      id: Date.now().toString(),
      projectId,
      projectTitle,
      projectCreator,
      applicantName: "Alex Johnson", // In real app, this would come from auth context
      applicantId: "alex-johnson",
      status: "pending",
      appliedAt: new Date().toISOString(),
      message,
    };

    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (applicationId, status) => {
    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? { ...app, status } : app))
    );
  };

  const getUserApplications = userId => {
    return applications.filter(app => app.applicantId === userId);
  };

  const getProjectApplications = projectId => {
    return applications.filter(app => app.projectId === projectId);
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        applyToProject,
        updateApplicationStatus,
        getUserApplications,
        getProjectApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
