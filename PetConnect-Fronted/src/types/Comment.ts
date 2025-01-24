export type Comment = {
    _id: string;
    content: string;
    owner: {
        email: string;
    };
}