import React from "react";
import { Card, CardContent, Typography, Box, CardMedia } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { toggleLike } from "../services/postApi";
interface PostCardProps {
  ownerEmail: string;
  title: string;
  description: string;
  postPicture: string | null;
  likes: number;
  commentsCount: number;
  id: string;
  onClick: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  ownerEmail,
  title,
  description,
  postPicture,
  likes,
  commentsCount,
  id,
  onClick,
}) => {
  const onLikeClick = async () => {
    try {
      const likes = await toggleLike(id);
      return likes;
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post. Please try again later.");
    }
  };
  return (
    <Card
      sx={{
        maxWidth: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        margin: "16px",
      }}
    >
      {postPicture && (
        <CardMedia
          component="img"
          image={postPicture}
          alt={title}
          sx={{ cursor: "pointer" }}
          onClick={() => onClick(id)}
        />
      )}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, // Ensures content stretches to fill available space
        }}
      >
        <Typography
          sx={{
            cursor: "pointer",
            justifyContent: "space-between",
            display: "flex",
          }}
          variant="h6"
          onClick={() => onClick(id)}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          By:{ownerEmail}
        </Typography>
        <Typography
          variant="body1"
          color="textPrimary"
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt="auto"
        >
          <Box display="flex" alignItems="center">
            <FavoriteIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body2" onClick={() => onLikeClick()}>
              {likes}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <ChatBubbleOutlineIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{commentsCount}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
