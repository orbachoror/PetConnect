import api from "./api";
export const getCommentsByPostId = async (postId: string) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
};

export const createComment = async (postId: string, content: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
};
export const deleteComment = async (commentId: string, postId: string) => {
    const response = await api.delete(`posts/${postId}/comments/${commentId}`);
    return response.data;
};

export const updateComment = async (commentId: string, postId: string | undefined, content: string) => {
    const response = await api.put(`posts/${postId}/comments/${commentId}`, { content });
    return response.data;
};