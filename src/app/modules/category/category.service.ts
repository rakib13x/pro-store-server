import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
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

export const CategoryService = {
    createCategoryIntoDb
}
