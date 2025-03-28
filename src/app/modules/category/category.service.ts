import { Prisma } from "@prisma/client";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { ICreateCategory } from "./category.interface";

const createCategoryIntoDb = async (data: ICreateCategory) => {

    const { name, image } = data;
    if (
        !name ||
        !image
    ) {
        throw new AppError(400, "All fields are required");
    }

    const category = await prisma.category.create({
        data: {
            name,
            image,
        },
    });

    return category;
};


const getAllCategories = async (
    paginationData: IPaginationOptions,
    params: Record<string, unknown>
) => {
    const { page, limit, skip } =
        paginationHelper.calculatePagination(paginationData);
    const { searchTerm, ...filterData } = params;

    let andCondition: Prisma.CategoryWhereInput[] = [];

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

    const whereConditions: Prisma.CategoryWhereInput = {
        AND: andCondition,
    };

    const categories = await prisma.category.findMany({
        where: whereConditions,
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

    const total = await prisma.category.count({
        where: whereConditions,
    });

    return {
        data: categories,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};


export const CategoryService = {
    createCategoryIntoDb,
    getAllCategories
}
