import api from "./api";
export const getCommentsByPostId = async (postId: string) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
};

export const createComment = async (postId: string, content: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
};
export const getCommentsCount = async (postId: string) => {
    try {
        const response = await api.get(`/posts/${postId}/comments`, {
            params: { countOnly: "true" },
        });
        return response.data.count; // Return the count
    } catch (error) {
        console.error("Failed to fetch comments count:", error);
        throw error;
    }
};