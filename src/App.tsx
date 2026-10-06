import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProductDashboard from './pages/ProductDashboard';

// 1. Komponen pembatas untuk halaman publik (Login)
// Jika SUDAH login (ada token), lempar langsung ke /dashboard
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

// 2. Komponen pembatas untuk halaman rahasia (Dashboard)
// Jika BELUM login (tidak ada token), lempar balik ke /login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Halaman Login: Bouncer bakal nolak kalau kamu udah punya token */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        {/* Halaman Dashboard: Wajib bawa token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProductDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root (/): Jika ada token langsung ke /dashboard, kalau gak ada ke /login */}
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
