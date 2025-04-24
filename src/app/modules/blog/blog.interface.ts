export interface ICreateBlog {
    image: string;
    title: string;
    content?: string | null;
    publishDate?: Date | string | null;
    authorId: string;
}

export interface IUpdateBlog {
    image?: string;
    title?: string;
    content?: string | null;
    publishDate?: Date | string | null;
}