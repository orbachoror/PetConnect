import React from 'react'
import {Card, CardContent, Typography, Box, CardMedia} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostCardProps {
    ownerEmail:string;
    title:string;
    postPicture:string | null;
    likes:number;
    commentsCount:number;
    id:string;
    onClick:(id:string)=>void;
}

const PostCard:React.FC<PostCardProps> = ({ownerEmail,title,postPicture,likes,commentsCount,id,onClick}) => {
    return (
        <Card
        sx = {{maxWidth:345,curesor:"pointer",margin:"16px"}}
        onClick={()=>onClick(id)}
        >
            {postPicture && (
            <CardMedia
            component="img"
            height="140"
            image={postPicture}
            alt={title}
            />
            )}
            <CardContent>
                <Typography variant ="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    By:{ownerEmail}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box display="flex" alignItems="center">
                        <FavoriteIcon color="error" sx={{mr:1}}/>
                        <Typography variant="body2">{likes}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <ChatBubbleOutlineIcon color="primary" sx = {{mr:1}}/>
                        <Typography variant="body2">{commentsCount}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
            
        )
            }
        

export default PostCard