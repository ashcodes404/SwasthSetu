import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Aboutus from "./components/Aboutus";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import AuthHandler from "./components/AuthHandler"; // import your AuthHandler
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: (
        <>
        <ProtectedRoute>
          <Navbar />
          <AuthHandler /> {/* Redirect after login */}
          <Home />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
        <ProtectedRoute>
          <Navbar />
          <Contact />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/aboutus",
      element: (
        <>
        <ProtectedRoute>
          <Navbar />
          <Aboutus />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
        <ProtectedRoute>
          <Navbar />
          <Dashboard />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/",
      element: (
        <>
          <AuthHandler /> {/* Check login at root as well */}
          <Login />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
