
export interface ICreateReview {
    productId: string;
    userId: string;
    content: string;
    rating?: number;
}


export interface IUpdateReview {
    content?: string;
    rating?: number;
}