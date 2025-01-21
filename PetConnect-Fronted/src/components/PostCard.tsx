import React from 'react'
import {Card,CardContent,Typography,Box} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostCardProps {
    owner:string;
    title:string;
    description:string;
    postPicture:string;
    likes:number;
    comments:number;
    id:string;
    onClick:(id:string)=>void;
}



export default PostCard