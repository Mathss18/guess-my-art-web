export type HttpBaseResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};
