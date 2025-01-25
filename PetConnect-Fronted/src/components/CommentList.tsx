import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Comment } from "../types/Comment";

interface commentListProps {
  comments: Comment[];
  onUpdateClick: (commentId: string, updatedComment: string) => void;
  onDeleteClick: (commentId: string) => void;
}

const CommentList: React.FC<commentListProps> = ({
  comments,
  onUpdateClick,
  onDeleteClick,
}) => {
  const [editMode, setEditMode] = useState<string>("");
  const [updatedComment, setUpdatedComment] = useState<string>("");

  const handleEditClick = (commentId: string, commentContent: string) => {
    setEditMode(commentId);
    setUpdatedComment(commentContent);
  };

  const handleSaveClick = (commentId: string) => {
    onUpdateClick(commentId, updatedComment);
    setEditMode("");
  };
  const handleCancelClick = () => {
    setEditMode("");
  };

  const userId = localStorage.getItem("userId");
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="textSecondary">
              {comment.owner.email}
            </Typography>

            {userId &&
              comment.owner._id === userId &&
              editMode !== comment._id && (
                <Box>
                  <Button
                    onClick={() =>
                      handleEditClick(comment._id, comment.content)
                    }
                  >
                    Edit
                  </Button>
                  <Button onClick={() => onDeleteClick(comment._id)}>
                    Delete
                  </Button>
                </Box>
              )}
          </Box>
          {userId &&
          comment.owner._id === userId &&
          editMode === comment._id ? (
            <Box>
              <TextField
                fullWidth
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
              />
              <Button onClick={() => handleSaveClick(comment._id)}>Save</Button>
              <Button onClick={handleCancelClick}>Cancel</Button>
            </Box>
          ) : (
            <Typography variant="body1">{comment.content}</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
