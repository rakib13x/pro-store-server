export interface ICreateOrder {
    userId: string;
    total: number;
    subTotal: number;
    shippingAddress: Record<string, any>;
    paymentMethod: string;
    orderItems: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    couponId?: string;
}

export interface IUpdateOrder {
    total?: number;
    subTotal?: number;
    shippingAddress?: Record<string, any>;
    paymentMethod?: string;
    paymentResult?: Record<string, any>;
    orderStatus?: "PENDING" | "ONGOING" | "DELIVERED" | "CANCELLED" | "RETURNED";
}

