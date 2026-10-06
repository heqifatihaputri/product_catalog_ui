import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProductDashboard from './pages/ProductDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute ke halaman Login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rute ke halaman Dashboard Produk */}
        <Route path="/dashboard" element={<ProductDashboard />} />

        {/* Kalau akses root (http://localhost:5173/), otomatis arahkan ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
