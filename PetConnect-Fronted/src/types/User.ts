
export type SenteziedUserType = {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    profilePicture: string;
};
export type UserType = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    profilePicture?: string;
    refreshTokens?: string[];
    _id?: string;
};