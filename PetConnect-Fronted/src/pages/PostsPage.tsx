import React, { useState, useEffect } from "react";
import { Container, Grid, CircularProgress } from "@mui/material";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postApi";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const PostsPage: React.FC = () => {
  interface Post {
    id: string;
    title: string;
    description: string;
    postPicture: string;
    likes: number;
    commentsCount: number;
    owner: {
      email: string;
    };
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        alert("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Container>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={3}>
            <PostCard
              id={post.id}
              title={post.title}
              description={post.description}
              postPicture={post.postPicture ? baseUrl + post.postPicture : null}
              likes={post.likes}
              commentsCount={post.commentsCount}
              ownerEmail={post.owner.email}
              onClick={(id) => navigate(`/posts/${id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsPage;
