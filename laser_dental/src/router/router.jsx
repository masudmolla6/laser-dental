import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import About from "../pages/Home/About/About";
import Contact from "../pages/Home/Contact/Contact";
import AuthLayout from "../layouts/AuthLayout";
import LogIn from "../authentication/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";

const router=createBrowserRouter([
    {
        path:"/",
        element:<MainLayout></MainLayout>,
        children:[
            {
                path:"/",
                element:<Home></Home>
            },
            {
                path:"/contact",
                element:<Contact></Contact>
            },
            {
                path:"/about",
                element:<About></About>
            }
        ]
    },
    {
    path: '/',
    element:<AuthLayout></AuthLayout>,
    children: [
            {
                path: 'login',
                element:<LogIn></LogIn>
            },
        ]
    },
    {
        path:"dashboard",
        element:<DashboardLayout></DashboardLayout>,
        children:[
            {
                path:"adminHome",
                element:<AdminHome></AdminHome>
            }
        ]
    }
])

export default router;