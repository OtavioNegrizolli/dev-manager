import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { api } from "../api"
import { Level } from "../model/level.dto";

const resourceURL = 'level';

type Attr = 'id' | 'name' | 'developers';

export const LevelService = {
    post: async (data: { name: string }): Promise<Level|'fail'> =>  {
        return await api.post(resourceURL, data);
    },
    patch: async (id: number, data: { name: string }): Promise<Level> => {
        return await api.patch(`${resourceURL}/${id}`, data);
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`${resourceURL}/${id}`);
    },
    get: async (id: number ): Promise<Level> => {
        return await api.get<Level>(`${resourceURL}/${id}`);
    },
    list: async (params: { [key: string]: any, orderBy: Attr, asc: 'true' | 'false', skip?: number, take?: number } ): Promise<Level[] | null> => {
        try {
            return await api.get<Level[]>(resourceURL, { params });
        }
        catch (e:any)
        {
            if (e) {
                if (e['response']) {

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
        }
        return null;
    }
}
