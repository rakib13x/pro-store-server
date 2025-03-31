import { Prisma } from "@prisma/client";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateProduct, IUpdateProduct } from "./product.interface";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";

const createProduct = async (data: ICreateProduct) => {
    const { name, description, price, quantity, productPhoto, categoryId } = data;

    if (
        !name ||
        !description ||
        !price ||
        !quantity ||
        !productPhoto ||
        !categoryId

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
            categoryId
        },

    });

    return product;
};



// product.service.ts
const getAllProducts = async (
    paginationData: IPaginationOptions,
    params: Record<string, unknown>
) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(paginationData);
    const { searchTerm, ...filterData } = params;

    let andCondition: Prisma.ProductWhereInput[] = [];
    andCondition.push({
        isDeleted: false,
    });

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData)
                .filter((field) => Boolean(filterData[field]))
                .map((field) => {
                    const value =
                        filterData[field] === "true"
                            ? true
                            : filterData[field] === "false"
                                ? false
                                : filterData[field];

                    return {
                        [field]: { equals: value },
                    };
                }),
        });
    }

    if (searchTerm) {
        andCondition.push({
            OR: [
                {
                    name: {
                        contains: searchTerm as string,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    const whereConditions: Prisma.ProductWhereInput = {
        AND: andCondition,
    };

    const products = await prisma.product.findMany({
        where: whereConditions,
        include: {
            category: true,
        },
        skip: skip,
        take: limit,
        orderBy: paginationData?.sort
            ? {
                [paginationData.sort.split("-")[0]]:
                    paginationData.sort.split("-")[1],
            }
            : {
                createdAt: "desc",
            },
    });

    const total = await prisma.product.count({
        where: whereConditions,
    });

    return {
        data: products,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
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
