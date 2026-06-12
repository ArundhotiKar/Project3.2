import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import StudentDashboard from "./StudentDashboard";
import LabAssistantDashboard from "./LabAssistantDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ChairmanDashboard from "./ChairmanDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";
import PublicHome from "../page/PublicHome";

const Dashboard = () => {
    const { role, user } = useContext(AuthContext);

    if (!user) {
        return <PublicHome />;
    }

    return (
        <div>
            {role === "student" && <StudentDashboard />}
            {role === "lab assistant" && <LabAssistantDashboard />}
            {role === "teacher" && <TeacherDashboard />}
            {role === "chairman" && <ChairmanDashboard />}
            {role === "super admin" && <SuperAdminDashboard />}
        </div>
    );
};

export default Dashboard;