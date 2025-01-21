import api from "./api";
export const getPosts = async () => {
    const response = await api.get("/posts");
    return response.data;
};

export const getPostById = async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
};

export const toggleLike = async (postId: string) => {
    try {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data.likes;
    } catch (error) {
        console.error("Failed to toggle like:", error);
    }

}