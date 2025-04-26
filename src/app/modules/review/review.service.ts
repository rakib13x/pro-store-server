import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateReview, ICreateReviewVote, IUpdateReview } from "./review.interface";

const addReview = async (data: any) => {
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

  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        paymentStatus: "COMPLETED",
      }
    }
  });

  if (!hasPurchased) {
    throw new AppError(403, "You can only review products you have purchased");
  }


  const existingReview = await prisma.review.findFirst({
    where: {
      productId,
      userId
    }
  });

  if (existingReview) {
    throw new AppError(400, "You have already reviewed this product");
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


const getReviewsByProductId = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: true,
    },
  });


  const reviewsWithVotes = await Promise.all(
    reviews.map(async (review) => {
      const votes = await prisma.reviewVote.findMany({
        where: { reviewId: review.reviewId },
        select: { vote: true },
      });

      const likeCount = votes.filter((vote) => vote.vote === 'LIKE').length;
      const dislikeCount = votes.filter((vote) => vote.vote === 'DISLIKE').length;

      return {
        ...review,
        votes: { likeCount, dislikeCount },
      };
    })
  );

  return reviewsWithVotes;
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

const createOrUpdateVote = async (data: ICreateReviewVote) => {
  const { reviewId, userId, vote } = data;
  const existingReview = await prisma.review.findUnique({
    where: { reviewId },
  });
  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  const existingVote = await prisma.reviewVote.findUnique({
    where: { reviewId_userId: { reviewId, userId } },
  });

  if (existingVote) {
    const updatedVote = await prisma.reviewVote.update({
      where: { reviewId_userId: { reviewId, userId } },
      data: { vote },
    });

    return updatedVote;
  } else {
    const newVote = await prisma.reviewVote.create({
      data: {
        reviewId,
        userId,
        vote,
      },
    });

    return newVote;
  }
};

const getVotesForReview = async (reviewId: string) => {
  const votes = await prisma.reviewVote.findMany({
    where: { reviewId },
    select: { vote: true },
  });

  const likeCount = votes.filter(vote => vote.vote === 'LIKE').length;
  const dislikeCount = votes.filter(vote => vote.vote === 'DISLIKE').length;

  return { likeCount, dislikeCount };
};

export const ReviewService = {
  addReview,
  updateReview,
  deleteReview,
  createOrUpdateVote,
  getVotesForReview,
  getReviewsByProductId
};