import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "./components/Toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTickets from "./pages/MyTickets";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/my-tickets" replace />;
  return children;
}

function CustomerRoute({ children }) {
  const { isLoggedIn, isCustomer } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isCustomer) return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer */}
      <Route path="/my-tickets" element={<CustomerRoute><MyTickets /></CustomerRoute>} />
      <Route path="/ticket/:ticket_id" element={<CustomerRoute><TicketDetail /></CustomerRoute>} />
      <Route path="/my-tickets/:ticket_id" element={<CustomerRoute><TicketDetail /></CustomerRoute>} />
      <Route path="/create-ticket" element={<CustomerRoute><CreateTicket /></CustomerRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}