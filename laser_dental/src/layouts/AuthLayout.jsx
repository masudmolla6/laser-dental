import React from 'react';
import Logo from '../Shared/Logo/Logo';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-base-200">

            <div className="mb-6">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;