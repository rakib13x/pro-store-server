export interface ICreateBlog {
    image: string;
    title: string;
    content?: string;
    publishDate?: Date | string;
    authorId: string;
}
export interface IUpdateBlog {
    image?: string;
    title?: string;
    content?: string;
    publishDate?: Date | string;
}
