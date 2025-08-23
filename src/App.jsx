import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Aboutus from "./components/Aboutus";
import Contact from "./components/Contact";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import AuthHandler from "./components/AuthHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {
  const { user, isAuthenticated } = useAuth0();

  // Create a wrapper to pass userId to Dashboard
  const DashboardWrapper = () => {
    if (!isAuthenticated) return null; // Or redirect or loader
    return (
      <>
        <Navbar />
        <Dashboard userId={user.sub} />
        <Footer />
      </>
    );
  };

  const HomeWrapper = () => (
    <>
      <Navbar />
      <AuthHandler /> {/* Redirect after login */}
      <Home />
      <Footer />
    </>
  );

  const ContactWrapper = () => (
    <>
      <Navbar />
      <Contact />
      <Footer />
    </>
  );

  const AboutWrapper = () => (
    <>
      <Navbar />
      <Aboutus />
      <Footer />
    </>
  );

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <HomeWrapper />
            </ProtectedRoute>
          ),
        },
        {
          path: "/contact",
          element: (
            <ProtectedRoute>
              <ContactWrapper />
            </ProtectedRoute>
          ),
        },
        {
          path: "/aboutus",
          element: (
            <ProtectedRoute>
              <AboutWrapper />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <DashboardWrapper />
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
      ])}
    />
  );
}

export default App;
