import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
