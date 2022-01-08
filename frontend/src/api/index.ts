import axios from "axios";

const addBaseUrl = (resource: string) => ('http://localhost:3001/' + resource);

export interface ApiRequestOptions {
    params: { [key: string]: string }
}
interface IApiService {
    get:    <T = any>(resource: string, options?: ApiRequestOptions) => Promise<T>;
    post:   <T = any>(resource: string, body: any, options?: ApiRequestOptions ) => Promise<T>;
    patch:  <T = any>(resource: string, body: any, options?: ApiRequestOptions ) => Promise<T>;
    delete: (resource: string, options?: ApiRequestOptions) => Promise<void>;
}

export const api: IApiService = {
    async get<T = any>( resource : string, options?: ApiRequestOptions ) {
        return (await axios.get(
            addBaseUrl(resource),
            { params: options?.params }
        )).data as T;
    },
    async post<T = any>(resource: string, body: any, options?: ApiRequestOptions ) {
        return (await axios.post(
            addBaseUrl(resource),
            body,
            { params: options?.params }
        )).data as T;
    },
    async patch<T = any>(resource: string, body: any, options?: ApiRequestOptions ) {
        return (await axios.patch(
            addBaseUrl(resource),
            body,
            { params: options?.params }
        )).data as T;
    },
    /**
     *
     * @param resource the name of the resource to request from API
     * @param options optinal http config for request
     */
    async delete(resource: string, options?: ApiRequestOptions): Promise<void> {
        await axios.delete(
            addBaseUrl(resource),
            { params: options?.params }
        );
        // most expected cases returns 204
    }
};

