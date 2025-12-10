import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import { ApiMethod } from "../../constants/enums/apiEnums";

interface ApiRequestProps {
    endpoint: any;
    body?: any;
    headers?: Record<string, string>;
}

export default function useApi<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const request = useCallback(async ({ endpoint, body = null, headers = {} }: ApiRequestProps) => {
        setLoading(true);
        setError(null);

        let url = typeof endpoint === "string" ? endpoint : endpoint.url;
        const method = typeof endpoint === "string" ? ApiMethod.GET : endpoint.method;
        url = url.replace(/\{([^}]+)\}/g, (_: any, key: any) => {
            if (!(key in body)) {
                throw new Error(`Missing value for URL parameter: ${key}`);
            }
            return String(body[key]);
        });


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
    }, []);

    return { data, error, loading, request };
}
