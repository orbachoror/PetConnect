export type Comment = {
    _id: string;
    content: string;
    owner: {
        _id: string;
        email: string;
    };
}