import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateBlog, IUpdateBlog } from "./blog.interface";

const createBlog = async (data: ICreateBlog) => {
  const { image, title, content, publishDate, authorId } = data;

  if (!image || !title || !authorId) {
    throw new AppError(400, "Image, title, and authorId are required");
  }

  // Check if author exists
  const author = await prisma.user.findUnique({
    where: { id: authorId },
  });

  if (!author) {
    throw new AppError(404, "Author (User) not found");
  }

  // Parse publish date if it's a string
  const parsedPublishDate =
    publishDate && typeof publishDate === "string"
      ? new Date(publishDate)
      : publishDate;

  const blog = await prisma.blog.create({
    data: {
      image,
      title,
      content,
      publishDate: parsedPublishDate,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        }
      },
      votes: true,
    },
  });

  return blog;
};

const updateBlog = async (blogId: string, data: IUpdateBlog) => {

  const existingBlog = await prisma.blog.findUnique({
    where: { blogId },
  });

  if (!existingBlog) {
    throw new AppError(404, "Blog not found");
  }

  // Parse publish date if it's a string
  const parsedPublishDate =
    data.publishDate && typeof data.publishDate === "string"
      ? new Date(data.publishDate)
      : data.publishDate;

  // Update the blog
  const updatedBlog = await prisma.blog.update({
    where: { blogId },
    data: {
      image: data.image,
      title: data.title,
      content: data.content,
      publishDate: parsedPublishDate,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        }
      },
      votes: true,
    },
  });

  return updatedBlog;
};

const deleteBlog = async (blogId: string) => {
  // Check if blog exists
  const existingBlog = await prisma.blog.findUnique({
    where: { blogId },
  });

  if (!existingBlog) {
    throw new AppError(404, "Blog not found");
  }

  // First delete all votes associated with the blog to avoid foreign key constraints
  await prisma.blogVote.deleteMany({
    where: { blogId },
  });

  // Delete the blog
  const deletedBlog = await prisma.blog.delete({
    where: { blogId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        }
      },
    },
  });

  return deletedBlog;
};

const getAllBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        }
      },
      votes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return blogs;
};

const getBlogById = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { blogId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        }
      },
      votes: true,
    },
  });

  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  return blog;
};

export const BlogService = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById
};