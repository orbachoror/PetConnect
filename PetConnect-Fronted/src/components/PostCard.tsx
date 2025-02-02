import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface PostCardProps {
  ownerEmail: string;
  title: string;
  description: string;
  postPicture: string | null;
  likes: number;
  likedBy: string[];
  commentsCount: number;
  id: string;
  userId: string;
  onClick: (id: string) => void;
  onToggleLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  ownerEmail,
  title,
  description,
  postPicture,
  likes,
  likedBy,
  commentsCount,
  id,
  userId,
  onClick,
  onToggleLike,
}) => {
  const isLiked = likedBy.includes(userId);
  return (
    <Card
      sx={{
        maxWidth: 320,
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.9)",
        },
        margin: "16px",
      }}
    >
      {postPicture && (
        <CardMedia
          component="img"
          image={postPicture}
          alt={title}
          sx={{
            cursor: "pointer",
            height: 180,
            objectFit: "fill",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
          onClick={() => onClick(id)}
        />
      )}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            cursor: "pointer",
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
            {onToggleLike ? (
              <IconButton onClick={onToggleLike}>
                <FavoriteIcon
                  color={isLiked ? "error" : "disabled"}
                  sx={{ mr: 1 }}
                />
              </IconButton>
            ) : (
              <FavoriteIcon
                color={isLiked ? "error" : "disabled"}
                sx={{ mr: 1 }}
              />
            )}
            <Typography variant="body2">{likes}</Typography>
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
