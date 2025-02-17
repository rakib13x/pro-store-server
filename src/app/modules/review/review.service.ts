
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateReview } from "./review.interface";

const addReview = async (data: ICreateReview) => {
  const { productId, userId, content, rating } = data;

  if (!productId || !userId || !content) {
    throw new AppError(400, "Product id, user id, and review content are required");
  }

  const productExists = await prisma.product.findUnique({
    where: { productId },
  });
  if (!productExists) {
    throw new AppError(404, "Product not found");
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userExists) {
    throw new AppError(404, "User not found");
  }


  const review = await prisma.review.create({
    data: {
      content,
      rating,
      productId,
      userId,
    },
    include: {
      product: true,
      user: true
    }
  });

  return review;
};

export const ReviewService = {
  addReview,
};
