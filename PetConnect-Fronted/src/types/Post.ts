export type Post = {
    _id: string;
    title: string;
    description: string;
    postPicture: string;
    likes: number;
    likedBy: string[];
    commentCount: number;
    owner: {
        _id: string;
        email: string;
    };
}

