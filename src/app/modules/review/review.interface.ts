
export interface ICreateReview {
    productId: string;
    userId: string;
    content: string;
    rating?: number;
}
