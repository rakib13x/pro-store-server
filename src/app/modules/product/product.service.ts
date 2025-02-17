import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateProduct, IUpdateProduct } from "./product.interface";

const createProduct = async (data: ICreateProduct) => {
    const { name, description, price, quantity, productPhoto, category } = data;

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



const getAllProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
    });

    return products;
};

const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { productId: id },
        include: { category: true },
    });

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    return product;
};


const deleteProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { productId: id },
    });

    if (!product) {
        throw new AppError(404, "Product not found");
    }



    const deletedProduct = await prisma.product.update({
        where: { productId: id },
        data: { isDeleted: true },
        include: { category: true },
    });

    return deletedProduct;
};



const updateProduct = async (id: string, data: IUpdateProduct) => {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
        where: { productId: id },
    });

    if (!existingProduct) {
        throw new AppError(404, "Product not found");
    }

    if (existingProduct.isDeleted) {
        throw new AppError(400, "Cannot update a deleted product");
    }


    const updateData: Record<string, any> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.productPhoto !== undefined) updateData.productPhoto = data.productPhoto;


    if (
        data.category &&
        (data.category.name !== undefined || data.category.image !== undefined)
    ) {
        updateData.category = {
            update: {
                ...(data.category.name !== undefined && { name: data.category.name }),
                ...(data.category.image !== undefined && { image: data.category.image }),
            },
        };
    }

    const updatedProduct = await prisma.product.update({
        where: { productId: id },
        data: updateData,
        include: { category: true },
    });

    return updatedProduct;
};

export const ProductService = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct
};
