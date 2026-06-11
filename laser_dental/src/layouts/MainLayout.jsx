import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import FloatingContact from '../components/FloatingContact/FloatingContact';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>

            {/* Floating Buttons */}
            <FloatingContact />

        </div>
    );
};

export default MainLayout;