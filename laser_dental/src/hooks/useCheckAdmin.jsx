import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';

const useCheckAdmin = () => {
    const {user}=useAuth();
    const axiosSecure=useAxiosSecure();
    const {data:admin, isLoading, refetch}=useQuery({
        queryKey:[user?.email, "admin"],
        queryFn:async()=>{
            const res=await axiosSecure.get("/admin/users");
            return res.data;
        }
    })
    return [admin,isLoading, refetch];
};

export default useCheckAdmin;