import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ProtectedRoute from "./components/protectedRoutes";
import LandingPage from "./components/landingPage";
import AuthHandler from "./components/authHandler"; 
import Appointments from "./components/appointments";
import Settings from "./components/settings";
import { DashboardProvider } from "./contexts/DashboardContext";
function App() {
  const hospitalData = JSON.parse(localStorage.getItem("hospital") || "{}");
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <LandingPage />
          <AuthHandler /> {/* Check login at root */}
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
     {
      path: "/appointments",
      element: (
        <ProtectedRoute>
          <Appointments />
        </ProtectedRoute>
      ),
    },
     {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ),
    },
  ]);

  return(<DashboardProvider hospitalId={hospitalData._id}>
   <RouterProvider router={router} />;
   </DashboardProvider>)
}

export default App;
