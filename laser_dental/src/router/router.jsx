import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import About from "../pages/Home/About/About";
import Contact from "../pages/Home/Contact/Contact";
import AuthLayout from "../layouts/AuthLayout";
import LogIn from "../authentication/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import ControlPanel from "../pages/Dashboard/ControlPanel/ControlPanel";
import AddBanner from "../pages/Dashboard/AddBanner/AddBanner";
import AddPicture from "../pages/Dashboard/AddPicture/AddPicture";
import ManageGallery from "../pages/Dashboard/ManageGallery/ManageGallery";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import ManageBanners from "../pages/Dashboard/ManageBanners/ManageBanners";
import AdminProfile from "../pages/Dashboard/AdminProfile/AdminProfile";
import ManageAppointments from "../pages/Dashboard/ManageAppointments/ManageAppointments";
import ManageReviews from "../pages/Dashboard/ManageReviews/ManageReviews";
import ManageServices from "../pages/Dashboard/ManageServices/ManageServices";
import Gallery from "../pages/Home/Gallery/Gallery";
import AllServices from "../pages/Services/AllServices/AllServices";
import ServiceDetails from "../pages/Services/ServiceDetails/ServiceDetails";
import AppointmentPage from "../pages/Appointments/AppointmentPage";
import ManageBranches from "../pages/Dashboard/ManageBranches/ManageBranches";
import BranchForm from "../pages/Dashboard/ManageBranches/BranchForm";
import ManageDoctors from "../pages/Dashboard/ManageDoctors/ManageDoctors";
import DoctorForm from "../pages/Dashboard/ManageDoctors/DoctorForm";
import VideoUpload from "../pages/Dashboard/VideoUpload/VideoUpload";
import ManageVideos from "../pages/Dashboard/ManageVideos/ManageVideos";
import DoctorsListing from "../pages/Home/DoctorsListing/DoctorsListing";
import DoctorDetails from "../pages/Home/DoctorDetails/DoctorDetails";

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
                path: "/doctors",
                element: <DoctorsListing></DoctorsListing>
            },
            {
                path: "/doctors/:slug",
                element: <DoctorDetails></DoctorDetails>
            },
            {
                path:"/about",
                element:<About></About>
            },
            {
                path:"/services",
                element:<AllServices></AllServices>
            },
            {
                path:"/services/:id",
                element:<ServiceDetails></ServiceDetails>
            },
            {
                path:"/gallery",
                element:<Gallery></Gallery>
            },
            {
                path:"/appointment",
                element:<AppointmentPage></AppointmentPage>
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
        path:"/dashboard",
        element:<PrivateRoute><AdminRoute><DashboardLayout></DashboardLayout></AdminRoute></PrivateRoute>,
        children:[
            {
                path:"adminHome",
                element:<AdminHome></AdminHome>
            },
            {
                path:"controlPanel",
                element:<ControlPanel></ControlPanel>
            },
            {
                path:"addBanner",
                element:<AddBanner></AddBanner>
            },
            {
                path:"manageBanners",
                element:<ManageBanners></ManageBanners>
            },
            {
                path:"addPicture",
                element:<AddPicture></AddPicture>
            },
            {
                path:"manageGallery",
                element:<ManageGallery></ManageGallery>
            },
            {
                path:"manageAppointments",
                element:<ManageAppointments></ManageAppointments>
            },{
                path:"manageReviews",
                element:<ManageReviews></ManageReviews>
            },
            {
                path:"manageServices",
                element:<ManageServices></ManageServices>
            },
            {
                path: "manageBranches",
                element:<ManageBranches></ManageBranches>
            },
            {
                path:"addBranch",
                element:<BranchForm></BranchForm>
            },
            {
                path:"editBranch/:id",
                element:<BranchForm></BranchForm>
            },
            {
                path: "manageDoctors",
                element: <ManageDoctors></ManageDoctors>
            },
            {
                path: "addDoctor",
                element: <DoctorForm></DoctorForm>
            },
            {
                path: "editDoctor/:id",
                element: <DoctorForm></DoctorForm>
            },
            {
                path: "adminProfile",
                element:<AdminProfile></AdminProfile>
            },
            {
                path: "videoUpload",
                element: <VideoUpload></VideoUpload>
            },
            {
                path:"manageVideos",
                element:<ManageVideos></ManageVideos>
            }
        ]
    }
])

export default router;