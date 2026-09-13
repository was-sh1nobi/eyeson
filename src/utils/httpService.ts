import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

let axiosInstancePromise: Promise<AxiosInstance> | undefined;

const getAxiosInstance = () => {
    axiosInstancePromise ??= import("axios").then(({ default: axios }) => {
        const axiosInstance = axios.create({
            baseURL: import.meta.env.PUBLIC_API_URL,
            withCredentials: true,
        });

        axiosInstance.interceptors.request.use((config) => {
            if (typeof window !== "undefined") {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            }
            return config;
        });

        return axiosInstance;
    });

    return axiosInstancePromise;
};

export const httpService = {
    async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.get(path, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.post(path, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.put(path, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async patch<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.patch(path, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.delete(path, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
