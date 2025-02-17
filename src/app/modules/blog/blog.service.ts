// blog.service.ts
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { ICreateBlog, IUpdateBlog } from "./blog.interface";

const createBlog = async (data: ICreateBlog) => {
  const { image, title, content, publishDate, authorId } = data;

  if (!image || !title || !authorId) {
    throw new AppError(400, "Image, title, and authorId are required");
  }

  const author = await prisma.user.findUnique({
    where: { id: authorId },
  });
  if (!author) {
    throw new AppError(404, "Author (User) not found");
  }

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
      author: true,
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

  const parsedPublishDate =
    data.publishDate && typeof data.publishDate === "string"
      ? new Date(data.publishDate)
      : data.publishDate;

  const updateData: IUpdateBlog = {
    ...data,
    publishDate: parsedPublishDate,
  };

  const updatedBlog = await prisma.blog.update({
    where: { blogId },
    data: updateData,
    include: { author: true },
  });

  return updatedBlog;
};

const deleteBlog = async (blogId: string) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { blogId },
  });

  if (!existingBlog) {
    throw new AppError(404, "Blog not found");
  }

  const deletedBlog = await prisma.blog.delete({
    where: { blogId },
    include: { author: true },
  });

  return deletedBlog;
};

const getAllBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    include: {
      author: true,
      votes: true,
    },
  });

  if (!blogs || blogs.length === 0) {
    throw new AppError(404, "No blogs found");
  }

  return blogs;
};

export const BlogService = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs
};
