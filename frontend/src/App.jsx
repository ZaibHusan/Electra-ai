import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/loader/Loader";


export default function App() {
  const { checkAuthStatus, isLoading } = useAuth();




  useEffect(() => {
    checkAuthStatus();
  }, [])


  if (isLoading) {
    return <Loader />
  }



  return <AppRoutes />
}
