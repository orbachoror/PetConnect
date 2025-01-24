import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PostsPage from "./pages/PostsPage";
import EventsPage from "./pages/Events";
import { useAuth } from "./hooks/Auth";
import ProfilePage from "./pages/Profile";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import { CircularProgress, Container } from "@mui/material";

function App() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
