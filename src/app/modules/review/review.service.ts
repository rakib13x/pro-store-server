
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateReview, IUpdateReview } from "./review.interface";

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


const updateReview = async (id: string, data: IUpdateReview) => {

  const existingReview = await prisma.review.findUnique({
    where: { reviewId: id },
  });

  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  const updatedReview = await prisma.review.update({
    where: { reviewId: id },
    data: {
      ...data,
    },
  });

  return updatedReview;
};

const deleteReview = async (id: string) => {
  const existingReview = await prisma.review.findUnique({
    where: { reviewId: id },
  });

  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  const deletedReview = await prisma.review.delete({
    where: { reviewId: id },
  });

  return deletedReview;
};


export const ReviewService = {
  addReview,
  updateReview,
  deleteReview
};
