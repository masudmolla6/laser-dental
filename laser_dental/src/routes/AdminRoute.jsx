import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCheckAdmin from "../hooks/useCheckAdmin";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [admin, isAdminLoading] = useCheckAdmin();
  const location = useLocation();

  // 🔥 loading handle (VERY IMPORTANT)
  if (loading || isAdminLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-ring loading-lg w-64"></span>
      </div>
    );
  }

  // ✅ only admin allowed
  if (user && admin) {
    return children;
  }

  // ❌ block others
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;