import { AxiosResponse } from "axios";
import api from "./api.service";
import { HttpBaseResponse } from "../domain/http/http-base-response";

export type CreateImageParams = {
  text: string;
};

export type CreateImageResponse = {
  imageUrl: string;
  userPrompt: string;
};

export type GuessImageParams = {
  text: string;
};

export type GuessImageResponse = {
  percentage: string;
};

export type GetRandomImageParams = {
  exclude?: string[];
};

export type GetRandomImageResponse = {
  id: string;
  title: string;
  url: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
};

export const imageService = {
  create: (data: CreateImageParams) =>
    api.post<unknown, AxiosResponse<HttpBaseResponse<CreateImageResponse>>>("images/new", data),
  getRandom: (data?: GetRandomImageParams) =>
    api.post<unknown, AxiosResponse<HttpBaseResponse<GetRandomImageResponse>>>(`images/random`, data),
  guess: (data: GuessImageParams) =>
    api.post<unknown, AxiosResponse<HttpBaseResponse<GuessImageResponse>>>(`images/guess`, data),
};
