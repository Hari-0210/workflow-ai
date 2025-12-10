// apiEnums.ts

export const ApiMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
} as const;

export type ApiMethod = (typeof ApiMethod)[keyof typeof ApiMethod];


export const createApi = (url: string, method: ApiMethod) => {
    return { url, method } as const;
};


