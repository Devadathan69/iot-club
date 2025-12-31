import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route
                                index
                                element={
                                    <ProtectedRoute memberOnly>
                                        <Home />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route
                                path="admin/*"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
