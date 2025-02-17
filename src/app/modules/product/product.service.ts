import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateProduct } from "./product.interface";

// Create a new product with a nested category creation
const createProduct = async (data: ICreateProduct) => {
    const { name, description, price, quantity, productPhoto, category } = data;

    // Validate required fields
    if (
        !name ||
        !description ||
        !price ||
        !quantity ||
        !productPhoto ||
        !category ||
        !category.name ||
        !category.image
    ) {
        throw new AppError(400, "All fields are required");
    }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            quantity,
            productPhoto,
            category: {
                create: {
                    name: category.name,
                    image: category.image
                },
            },
        },
        include: {
            category: true
        }
    });

    return product;
};

export const ProductService = {
    createProduct,
};
