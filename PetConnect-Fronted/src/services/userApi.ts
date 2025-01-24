import api from "./api";

export const getUser = async () => {
    const response = await api.get('/user');
    console.log("user data after get ", response.data);
    return response.data;
};
export const updateUser = async (user: FormData) => {
    try {
        const response = await api.put("/user", user);
        return response.data;
    } catch (error) {
        console.error("Failed to update user:", error);
    }
}