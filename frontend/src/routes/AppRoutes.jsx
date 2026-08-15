import { Route, Routes, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import Login from '../pages/login/Login'
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout'
import ProtectedRoute from '../utils/ProtectedRoute'
import Prompts from '../pages/prompts/Prompts'
import Knoledge from '../pages/knowledge/Knoledge'
import Inbox from '../pages/inbox/Inbox'
import Dashboard from '../pages/dashboard/Dashboard'
import Settings from '../pages/settings/Settings'

export default function AppRoutes() {

    const dashboardRoutes = [
        { path: '/inbox', element: <Inbox />, label: 'Inbox' },
        { path: '/prompts', element: <Prompts />, label: 'Prompts' },
        { path: '/knowledge', element: <Knoledge />, label: 'Knowledge' }, // ✅ Fixed component
        { path: '/dashboard', element: <Dashboard />, label: 'Dashboard' },
        { path: '/settings', element: <Settings />, label: 'Settings' },
    ];

    return (
        <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                {/* Default redirect to inbox */}
                <Route path="/" element={<Navigate to="/inbox" replace />} />
                
                {/* Map through dashboard routes */}
                {dashboardRoutes.map((route) => (
                    <Route 
                        key={route.path} 
                        path={route.path} 
                        element={route.element} 
                    />
                ))}
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/inbox" replace />} />
        </Routes>
    )
}