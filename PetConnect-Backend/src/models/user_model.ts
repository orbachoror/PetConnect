import mongoose from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;

    refreshTokens?: string[];
}