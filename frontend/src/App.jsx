import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import Dashboard from './pages/Dashboard';
import Membership from './pages/Membership';

// PrivateRoute component to restrict access to sensitive actions 
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router> {/* This MUST be the outermost wrapper for routing hooks to work */}
      <AuthProvider>
        <Navbar />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/create-post" element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
export default App;