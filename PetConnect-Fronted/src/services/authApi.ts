import { CredentialResponse } from "@react-oauth/google";
import api from "./api";

export const loginApi = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
        email,
        password
    })
    return response.data;
}

export const googleSignIn = async (credentialResponse:CredentialResponse) => {
    const response = await api.post("/auth/google", {credentialResponse})
    return response.data;
}

export const logoutApi = async (refreshToken: string | null) => {
    const response = await api.post("/auth/logout", { refreshToken: refreshToken });
    return response.status; // need to check if need the status after logout
}
export const registerApi = async (registerForm: FormData) => {
    await api.post("/auth/register", registerForm);
}