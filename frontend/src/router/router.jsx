import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import SignInPage from "../page/SignInPage";
import SignUpPage from "../page/SignUpPage";
import Dashboard from "../Dashboard/Dashboard";
import ReportIssue from "../Dashboard/ReportIssue";
import Problem from "../Dashboard/Problem";
import Approvals from "../page/Approvals";
import LabsPage from "../page/LabsPage";
import LabDetailPage from "../page/LabDetailPage";
import EquipmentPage from "../page/EquipmentPage";
import UsersPage from "../page/UsersPage";
import Issues from "../page/Issues";
import Departments from "../page/Departments";
import ProtectedRoute from "./ProtectedRoute";
import PublicHome from "../page/PublicHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element:<ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
         path: "home",
         element: <PublicHome/>
      }, 
      {
        path: "signin",
        element: <SignInPage />
      },
      {
        path: "signup",
        element: <SignUpPage />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "labs",
        element: <LabsPage />
      },
      {
        path: "labs/:id",
        element: <LabDetailPage />
      },
      {
        path: "equipment",
        element: <EquipmentPage />
      },
      {
        path: "users",
        element: <UsersPage />
      },
      {
        path: "report-issue",
        element: <ReportIssue />
      },
      {
        path: "problems",
        element: <Problem/>
      },
      {
        path: "approvals",
        element: <Approvals />
      },
      {
        path: "issues",
        element: <Issues/>
      },
      {
        path: "departments",
        element: <Departments/>
      }
      
    ]
  },
]);

export default router;