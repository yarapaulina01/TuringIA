import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProductFormPage from './pages/ProductFormPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/admin/products/create" element={<ProductFormPage />} />
            <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />
        </Routes>
    );
}

export default App;