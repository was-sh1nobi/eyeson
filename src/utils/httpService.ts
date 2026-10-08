import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

let axiosInstancePromise: Promise<AxiosInstance> | undefined;

const getAxiosInstance = () => {
    axiosInstancePromise ??= import("axios").then(({ default: axios }) => {
        const axiosInstance = axios.create({
            baseURL: import.meta.env.PUBLIC_API_URL,
            // Never send cookies / HTTP auth cross-origin.
            // The backend replies with `Access-Control-Allow-Origin: *`,
            // which browsers reject when credentials mode is `include`.
            withCredentials: false,
        });
        axiosInstance.defaults.withCredentials = false;

        axiosInstance.interceptors.request.use((config) => {
            // Force-disable credentials on every request, even if a caller
            // passes `withCredentials: true` in per-request config.
            config.withCredentials = false;
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
            const response: AxiosResponse<T> = await axiosInstance.get(path, { ...config, withCredentials: false });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.post(path, data, { ...config, withCredentials: false });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.put(path, data, { ...config, withCredentials: false });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async patch<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.patch(path, data, { ...config, withCredentials: false });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
        const axiosInstance = await getAxiosInstance();
        try {
            const response: AxiosResponse<T> = await axiosInstance.delete(path, { ...config, withCredentials: false });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
