import { HttpError } from '@refinedev/core';

export const transformHttpError = (error: any): HttpError => {
  // const message = error?.response?.data?.error?.message;
  // const statusCode = error?.response?.data?.error?.status;
  // const errors = error?.response?.data?.error?.details;

  // const httpError: HttpError = {
  //   statusCode,
  //   message,
  //   errors,
  // };

  return error;
};
