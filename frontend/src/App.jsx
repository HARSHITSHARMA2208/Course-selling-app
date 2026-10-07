import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import UserSignup from './pages/UserSignup';
import UserSignin from './pages/UserSignin';
import AdminSignup from './pages/AdminSignup';
import AdminSignin from './pages/AdminSignin';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import PurchaseCourse from './pages/PurchaseCourse';
import MyPurchases from './pages/MyPurchases';
import NotFound from './pages/NotFound';
import API from './api';
import { ToastProvider } from './components/Toast';

function AppContent() {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || '');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [userProfile, setUserProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const handleUserLogin = (token) => {
    localStorage.setItem('userToken', token);
    setUserToken(token);
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setAdminProfile(null);
  };

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    localStorage.removeItem('userToken');
    setUserToken('');
    setUserProfile(null);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setUserToken('');
    setUserProfile(null);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setAdminProfile(null);
  };

  // Load user profile on token change
  useEffect(() => {
    if (userToken) {
      API.get('/user/profile')
        .then((res) => {
          setUserProfile(res.data.user);
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
          handleUserLogout();
        });
    } else {
      setUserProfile(null);
    }
  }, [userToken]);

  // Load admin profile on token change
  useEffect(() => {
    if (adminToken) {
      API.get('/admin/profile')
        .then((res) => {
          setAdminProfile(res.data.admin);
        })
        .catch((err) => {
          console.error('Error fetching admin profile:', err);
          handleAdminLogout();
        });
    } else {
      setAdminProfile(null);
    }
  }, [adminToken]);

  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col bg-[#0f1117] text-[#f0f0f5]">
        <Navbar
          userToken={userToken}
          adminToken={adminToken}
          userProfile={userProfile}
          adminProfile={adminProfile}
          onUserLogout={handleUserLogout}
          onAdminLogout={handleAdminLogout}
        />

        <main className="main-content flex-grow pt-20">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home userToken={userToken} />} />
            <Route path="/courses" element={<Courses userToken={userToken} />} />
            <Route path="/about" element={<About />} />

            {/* Student Auth Routes */}
            <Route
              path="/signup"
              element={userToken ? <Navigate to="/" /> : <UserSignup onUserLogin={handleUserLogin} />}
            />
            <Route
              path="/signin"
              element={userToken ? <Navigate to="/" /> : <UserSignin onUserLogin={handleUserLogin} />}
            />

            {/* Admin Auth Routes */}
            <Route
              path="/admin/signup"
              element={adminToken ? <Navigate to="/admin/dashboard" /> : <AdminSignup onAdminLogin={handleAdminLogin} />}
            />
            <Route
              path="/admin/signin"
              element={adminToken ? <Navigate to="/admin/dashboard" /> : <AdminSignin onAdminLogin={handleAdminLogin} />}
            />

            {/* Student Protected Routes */}
            <Route
              path="/purchase/:courseId"
              element={userToken ? <PurchaseCourse userToken={userToken} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/purchases"
              element={userToken ? <MyPurchases userToken={userToken} /> : <Navigate to="/signin" />}
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={adminToken ? <AdminDashboard adminToken={adminToken} adminProfile={adminProfile} /> : <Navigate to="/admin/signin" />}
            />
            <Route
              path="/admin/create-course"
              element={adminToken ? <CreateCourse adminToken={adminToken} /> : <Navigate to="/admin/signin" />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
