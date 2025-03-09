import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CruiseDetailsPage from './pages/Cruises/CruiseDetailsPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useEffect } from 'react';
import useAuthStore from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Log authentication status for debugging
  useEffect(() => {
    console.log('Auth status:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cruises" element={<HomePage />} />
          <Route 
            path="/cruises/:id" 
            element={
              <ProtectedRoute>
                <CruiseDetailsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
