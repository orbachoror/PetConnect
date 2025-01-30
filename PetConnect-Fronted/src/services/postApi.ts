import api from "./api";
export const getPosts = async (page: number, sortBy?: string, sortOrder: "asc" | "desc" = "desc", category?: string) => {
    const response = await api.get("/posts", {
        params: {
            page,
            limit: 4,
            sortBy,
            sortOrder,
            category: category === "All" ? undefined : category,
        }
    });
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

export const updatePost = async (postId: string, post: FormData) => {
    try {
        const response = await api.put(`/posts/${postId}`, post);
        return response.data;
    } catch (error) {
        console.error("Failed to update post:", error);
    }
}

export const deletePost = async (postId: string) => {
    try {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete post:", error);
    }
}