import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Aboutus from "./components/Aboutus";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import AuthHandler from "./components/AuthHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/footer";

function App() {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <div>
            <Navbar />
            <AuthHandler /> {/* Redirect after login */}
            <Home />
            <Footer/>
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: "/contact",
      element: (
        <ProtectedRoute>
          <div>
            <Navbar />
            <Contact />
             <Footer/>
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: "/aboutus",
      element: (
        <ProtectedRoute>
          <div>
            <Navbar />
            <Aboutus />
             <Footer/>
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <div>
            <Navbar />
            <Dashboard />
             <Footer/>
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <div>
          <AuthHandler /> {/* Check login at root as well */}
          <Login />
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
