import { Navigate, Route, Routes } from "react-router-dom";
import AuthLanding from "./components/Register/AuthLanding";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthLanding />} />
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
