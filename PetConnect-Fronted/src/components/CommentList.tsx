import React from "react";
import { Box, Typography } from "@mui/material";

interface Comment {
  content: string;
  owner: {
    email: string;
  };
}

const CommentList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  return (
    <Box>
      {comments.map((comment, index) => (
        <Box
          key={index}
          mt={2}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius="8px"
        >
          <Typography variant="body2" color="textSecondary">
            {comment.owner.email}
          </Typography>
          <Typography variant="body1">{comment.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
