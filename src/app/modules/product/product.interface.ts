export interface ICreateProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string
    productPhoto: string;
}

export interface IUpdateProduct {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    productPhoto?: string;
    category?: {
        name?: string;
        image?: string;
    };
}

