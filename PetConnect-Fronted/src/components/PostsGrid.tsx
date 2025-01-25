import React from "react";
import { Grid } from "@mui/material";
import PostCard from "./PostCard";
import { Post } from "../types/Post";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/";

interface PostsGridProps {
  posts: Post[];
  onToggleLike?: (postId: string) => void;
  userId: string;
}

const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  userId,
  onToggleLike,
}) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item key={post._id} xs={12} sm={6} md={3}>
          <PostCard
            id={post._id}
            userId={userId}
            title={post.title}
            description={post.description}
            postPicture={post.postPicture ? baseUrl + post.postPicture : null}
            likes={post.likes}
            commentsCount={post.commentsCount}
            ownerEmail={post.owner.email}
            likedBy={post.likedBy}
            onClick={(id) => navigate(`/posts/${id}`)}
            onToggleLike={() => (onToggleLike ? onToggleLike(post._id) : null)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostsGrid;
