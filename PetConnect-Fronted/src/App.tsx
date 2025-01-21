import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PostsPage from './pages/Posts';
import EventsPage from './pages/Events';
import { AuthProvider } from './hooks/Auth';
import ProfilePage from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<ProfilePage />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
