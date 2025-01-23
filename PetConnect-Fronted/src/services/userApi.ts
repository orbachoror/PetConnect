import api from "./api";

export const getUser = async () => {
    const response = await api.get(`/users/}`);
    return response.data;
};
export const updateUser = async (user: FormData) => {
    try {
        const response = await api.put("/users", user);
        return response.data;
    } catch (error) {
        console.error("Failed to update user:", error);
    }
}