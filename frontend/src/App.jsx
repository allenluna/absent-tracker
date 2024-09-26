import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notfound from './pages/Notfound';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './pages/MainLayout';
import AddUser from './pages/AddUser';
import Home from './pages/Home';
import Reports from './pages/Reports';
import api from './api';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [isAdmin, setIsAdmin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUserDomain, setIsUserDomain] = useState("");

  useEffect(() => {
    admin();
    // api_test();
    // userDomain();
  }, []);

  const admin = async () => {
    try {
      const response = await api.get('/api/users/current/');
      // Check if the user is an admin
      console.log(response)
      setIsAdmin(response.data.userStatus === 'admin');
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response.message === "Request failed with status code 401" && error.response.status === 401) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

// const api_test = async () => {
//     try {
//       const response = await api.get('/api/test-api/');
      
//       console.log(response.data.data)
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     }
//   };


  // const userDomain = async () => {
  //   try {
  //     const response = await api.get("/api/userdomain/");
  //     setIsUserDomain(response.data);
  //     console.log(response.data)
  //   } catch (error) {
  //     toast.error("Error fetching user domain:", error);
  //   }
  // };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          {isAdmin === "admin" ? (
            <>
              <Route path="adduser" element={<AddUser />} />
              <Route path="reports" element={<Reports />} />
            </>
          ) : null}
          <Route path="*" element={<Notfound />} />
        </Route>
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          {isAdmin === "report" ? (
            <>
              <Route path="reports" element={<Reports />} />
            </>
          ) : null}
          <Route path="*" element={<Notfound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
