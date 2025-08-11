import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Aboutus from "./components/Aboutus";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import AuthHandler from "./components/AuthHandler"; // import your AuthHandler

function App() {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: (
        <>
          <Navbar />
          <AuthHandler /> {/* Redirect after login */}
          <Home />
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
          <Navbar />
          <Contact />
        </>
      ),
    },
    {
      path: "/aboutus",
      element: (
        <>
          <Navbar />
          <Aboutus />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Navbar />
          <Dashboard />
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
