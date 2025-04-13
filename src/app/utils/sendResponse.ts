import { Response } from "express";
type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

interface IResponseData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: TMeta;
  data: T;
  redirectTo?: string;
}

const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
  res.status(data.statusCode).send({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data?.meta,
    data: data?.data,
    redirectTo: data?.redirectTo,
  });
};

export default sendResponse;
