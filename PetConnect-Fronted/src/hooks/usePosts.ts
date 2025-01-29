import { useState, useCallback} from "react";
import { getPosts } from "../services/postApi";
import { getCommentsCount } from "../services/commentApi";
import { Post } from "../types/Post";

const usePosts = (userId?: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    

    const fetchPostsWithComments = useCallback(async (pageToFetch: number,) => {
        setLoading(true);
        try {
            const data = await getPosts(pageToFetch); // getPosts() --> response.data
            const newPosts= data.data;
    
            if( data.pagination.currentPage >= data.pagination.totalPages){
                setHasMore(false);
            }

            const filteredPosts = userId 
            ? newPosts.filter((post: Post) => post.owner._id === userId) 
            : newPosts;

            const updatedPosts = await Promise.all(
                filteredPosts.map(async (post: Post) => {
                    const commentsCount = await getCommentsCount(post._id);
                    return { ...post, commentsCount };
                })
            );

            setPosts((prevPosts)=>[...prevPosts,...updatedPosts]);
        } catch (error) {
            console.error("Failed to fetch posts with comments:", error);
            alert("Failed to fetch posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    
    const loadMore= async()=>{
        if(hasMore && !loading){
            await fetchPostsWithComments(page);
            setPage((prevPage)=>prevPage+1);
        }
    }

    useState(() => {
        fetchPostsWithComments(1);
        setPage(2);
    },);

    return { posts, loading, setPosts, loadMore, hasMore };
};

export default usePosts;
