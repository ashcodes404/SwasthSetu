import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Aboutus from "./components/Aboutus";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        
        <>
          <Navbar />
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
      path: "/login",
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;

}

export default App;
