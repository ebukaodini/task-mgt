import axios, { AxiosInstance, AxiosResponse } from "axios";

export class http {
  axiosInstance: AxiosInstance;
  static responseBody = (response: AxiosResponse) => response.data;

  public constructor(hostUrl: string, headers?: object) {
    this.axiosInstance = axios.create({
      baseURL: hostUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      timeout: 300000,
    });
  }

  async get(endpoint: string, params?: any): Promise<any> {
    return await this.axiosInstance.get(endpoint, {
      params,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async post<T>(endpoint: string, data: T): Promise<any> {
    return await this.axiosInstance.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async put<T>(endpoint: string, data: T): Promise<any> {
    return await this.axiosInstance.put<T>(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async patch<T>(endpoint: string, data: T): Promise<any> {
    return await this.axiosInstance.patch<T>(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async delete<T>(endpoint: string, params?: any, data?: T): Promise<any> {
    return await this.axiosInstance.delete<T>(endpoint, {
      params,
      data,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}
