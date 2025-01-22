import api from "./api";
export const getPosts = async () => {
    const response = await api.get("/posts");
    return response.data;
};

export const getPostById = async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
};
export const createPost = async (post: FormData) => {
    try {
        const response = await api.post("/posts", post);
        return response.data;
    } catch (error) {
        console.error("Failed to create post:", error);
    }
}

export const toggleLike = async (postId: string) => {
    try {
        const response = await api.put(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error("Failed to toggle like:", error);
    }
}