import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const LogIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { logIn } = useAuth();
    const axiosSecure=useAxiosSecure();

    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        setLoading(true);
        setError("");

        logIn(data.email, data.password)
            .then(async (result) => {
                const user = result.user;

                // 🔥 Firebase ID Token (MAIN THING)
                const token = await user.getIdToken();

                // 🔐 store token for backend access
                localStorage.setItem("access-token", token);

                const res=await axiosSecure.post("http://localhost:5000/users", { email: user.email });
                console.log(res);
                if(res.data.insertedId){
                    Swal.fire({
                    title: "Drag me!",
                    icon: "success",
                    draggable: true
                    });
                }

                // redirect user
                navigate(from, { replace: true });
            })
            .catch((error) => {
                setError("Invalid email or password");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center sm:px-2">

            <div className="card bg-base-100 w-full max-w-md shadow-2xl">

                <div className="card-body flex flex-col items-center">

                    <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4">
                        Login Now
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-2 sm:px-2">

                        <fieldset>

                            {/* Email */}
                            <div>
                                <label className="label text-sm sm:text-base">Email</label>
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="input input-bordered w-full h-10 sm:h-12 text-sm sm:text-base"
                                    placeholder="Email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">Email is required</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="label text-sm sm:text-base">Password</label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: true,
                                        minLength: 6
                                    })}
                                    className="input input-bordered w-full h-10 sm:h-12 text-sm sm:text-base"
                                    placeholder="Password"
                                />

                                {errors.password?.type === 'required' && (
                                    <p className='text-red-500 text-sm'>
                                        Password is required
                                    </p>
                                )}
                                {errors.password?.type === 'minLength' && (
                                    <p className='text-red-500 text-sm'>
                                        Password must be 6+ characters
                                    </p>
                                )}
                            </div>

                            {/* API Error */}
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            {/* Button */}
                            <button
                                disabled={loading}
                                className="btn btn-primary text-black mt-4 w-full h-10 sm:h-12 text-sm sm:text-base"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </fieldset>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default LogIn;