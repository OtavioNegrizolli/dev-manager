import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { api } from "../api"
import { Developer } from "../model/developer.dto";

const resourceURL = 'developer';

export const DeveloperService = {
    post: async (data: {
        name: string;
        level: number;
        gender: string;
        birthDate: Date;
        hobby?: string;
    }): Promise<Developer> =>  {
        console.warn(data);

        return await api.post(resourceURL, data);
    },
    patch: async (id: number, data: {
        name: string;
        level: number;
        gender: string;
        birthDate: Date;
        hobby?: string;
    }): Promise<Developer> => {
        return await api.patch(`${resourceURL}/${id}`, data);
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`${resourceURL}/${id}`);
    },
    get: async (id: number ): Promise<Developer> => {
        return await api.get<Developer>(`${resourceURL}/${id}`);
    },
    list: async (params: { [key: string]: string, orderBy: keyof Developer, asc: 'true' | 'false' } ): Promise<Developer[] | null> => {
        try {
            return await api.get<Developer[]>(resourceURL, { params });
        }
        catch (e)
        {
            if (e) {
                const { response: { data, status} } = e as any;
                if ( status >= 500 ) {
                    Swal.fire('Error!',
                        data.message || data.erro || data,
                        'error'
                    );
                }
                else {
                    toast.warn('Nenhum registro foi encontrado!');
                }
            }
        }
        return null;
    }
}
