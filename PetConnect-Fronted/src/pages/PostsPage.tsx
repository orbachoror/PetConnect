import React,{useState , useEffect} from 'react'
import {Container,Grid,CircularProgress} from '@mui/material'
import PostCard from '../components/PostCard'
import {getPosts} from '../services/postApi'
import { useNavigate } from 'react-router-dom'


const   PostsPage:React.FC = () => {
    const [posts,setPosts] = useState<any[]>([])
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts()
                setPosts(posts)
            } catch (error) {
                console.error('Failed to fetch posts:', error)
                alert('Failed to fetch posts. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])
    if (loading) {
        return (
            <Container>
                    <CircularProgress />
            </Container>
        );
    }
    return(
        <Container>
            <Grid container spacing={2}>
                {posts.map(post => (
                    <Grid item key={post.id} xs={12} sm={6} md={4}>
                        <PostCard 
                        id={post.id}
                        title={post.title}
                        postPicture={post.postPicture}
                        likes = {post.likes}
                        commentsCount = {post.commentsCount}
                        onClick={(id) => navigate(`/posts/${id}`)} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )

export default Posts