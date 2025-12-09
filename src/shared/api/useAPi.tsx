import { useState, useCallback } from "react";
import { AxiosError, type Method } from "axios";
import axiosInstance from "./axiosInstance";

interface ApiRequestProps {
    url: string;
    method?: Method;
    body?: any;
    headers?: Record<string, string>;
}

interface ApiResponse<T> {
    data: T | null;
    error: AxiosError | null;
    loading: boolean;
    request: (options: ApiRequestProps) => Promise<{ data: T | null; error: AxiosError | null }>;
}

export default function useApi<T = any>(): ApiResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const request = useCallback(
        async ({ url, method = "GET", body = null, headers = {} }: ApiRequestProps) => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance({
                    url,
                    method,
                    data: body,
                    headers,
                });

                setData(response.data);
                return { data: response.data, error: null };
            } catch (err: any) {
                setError(err);
                return { data: null, error: err };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { data, error, loading, request };
}
