import { FormEvent, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Shell from "../../components/shell/shell";
import { FaPen, FaSearch, FaTrashAlt, FaArrowDown, FaArrowUp, FaArrowsAltV } from 'react-icons/fa';
import Link from "next/link";
import { useCallback } from "react";
import ReactTooltip from "react-tooltip";

import styles from '../../styles/list.module.css';
import { toast } from "react-toastify";
import { Developer } from "../../model/developer.dto";
import { DeveloperService } from "../../services/dev.service";

type Attrs =  keyof Developer;

const DevList = () =>
{
    const [devs, setDevs] = useState<Developer[] | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const levelInputRef = useRef<HTMLInputElement>(null);

    const [orderBy, setOrderBy] = useState<Attrs>('id');
    const [asc, setAsc] = useState<boolean>(true);

    const onSubmit = useCallback(( e?: FormEvent) => {
        e?.preventDefault();
        const params = { orderBy, asc:`${asc}` };
        const name =  nameInputRef.current?.value;
        const level =  levelInputRef.current?.value;
        if ( name ) Object.assign(params, { name });
        if ( level ) Object.assign(params, { level });
        DeveloperService
            .list({ ...params, orderBy, asc: asc? 'true':'false' })
            .then( setDevs );
    }, [orderBy, asc]);

    function toggleOrderBy(col: Attrs) {
        if ( col === orderBy )
            setAsc(!asc);
        else
        {
            setOrderBy(col);
            setAsc(true);
        }
    }

    function getOrderByIcon(col: Attrs) {
        return orderBy === col? (asc? <FaArrowDown/> : <FaArrowUp/>) : <FaArrowsAltV/>;
    }

    useEffect(() => {
        onSubmit();
    }, [orderBy,asc]);

    const onDelete = useCallback((id: number) => {
        const toDelete = devs?.find( l => l.id == id);
        Swal.fire({
            titleText: 'Você tem certeza?',
            text: `Esta ação não poderá ser desfeita! Deseja excluir ${toDelete?.name}?`,
            confirmButtonText: 'Sim!',
            denyButtonText: 'Não!',
            showDenyButton: true,
            showConfirmButton: true,
            focusDeny: true
        }).then( (result) => {
            if ( result.isConfirmed)
            {
                DeveloperService.delete(id).then( () => {
                    toast.success('Excluido com sucesso!');
                    onSubmit();
                })
                .catch( e =>{
                    if ( e ) {
                        const { response: { status, data } } = e;
                        if ( status === 503 ) {
                            Swal.fire(
                                'Aviso!',
                                data?.message || data?.error || data,
                                'warning'
                            );
                        }
                    }
                });
            }
        });
    }, [devs]);

    return (
        <Shell title="Desenvolvedores">
            <div className="card pb-4 justify-content-certer">
                <form onSubmit={onSubmit} className="card-body ">
                    <div className="row">
                        <div className="col form-control">
                            <label htmlFor="nome">Nome</label>
                            <input ref={nameInputRef} type="text" id="nome" className="form-control" />
                        </div>
                        <div className="col form-control">
                            <label htmlFor="nome">Nivel</label>
                            <input ref={levelInputRef} type="text" id="nome" className="form-control" />
                        </div>
                        <div className="col-1 d-flex align-items-center">
                            <button type="submit"className="btn btn-primary" style={{flexGrow:0}}>
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="card mt-5">
                <div className=" table-responsive w-100">
                    <table className="table table-striped table-hover">
                        <thead className={styles.thead}>
                            <th scope="col" onClick={() => toggleOrderBy('id')}>
                                <div>Id {getOrderByIcon('id')}</div>
                            </th>
                            <th scope="col" onClick={() => toggleOrderBy('name')}>
                                <div>Nome{getOrderByIcon('name')}</div>
                            </th>
                            <th scope="col" onClick={() => toggleOrderBy('level')}>
                                <div>Nível{getOrderByIcon('level')}</div>
                            </th>
                            <th scope="col" onClick={() => toggleOrderBy('gender')}>
                                <div>Sexo{getOrderByIcon('gender')}</div>
                            </th>
                            <th scope="col" onClick={() => toggleOrderBy('hobby')}>
                                <div>Hobby{getOrderByIcon('hobby')}</div>
                            </th>
                            {/* <th scope="col">
                                Qtd. Devs
                            </th> */}
                            <th scope="col"></th>
                        </thead>
                        <tbody className={styles.tbody}>
                            {
                                devs?.map( dev => (
                                    <tr key={dev.id}>
                                        <th scope="row">{dev.id}</th>
                                        <td width="">{dev.name}</td>
                                        <td width="">{dev.level}</td>
                                        <td width="">{dev.gender == 'm'? 'Masculino' : 'Feminino'}</td>
                                        <td width='30%'>{dev.hobby}</td>
                                        {/* <td>{level.totalDevelopers}</td> */}
                                        <td className={styles.actions} width='15%'>
                                            <Link href={`/dev/${dev.id}`}>
                                                <a data-for="tip-edit" data-tip="Editar" role="button">
                                                    <FaPen className="color-secondary"/>
                                                </a>
                                            </Link>
                                            <ReactTooltip id="tip-edit" effect="solid">Editar</ReactTooltip>
                                            <a data-for="tip-delete" data-tip="Deletar" role="button" onClick={() => onDelete(dev.id)}>
                                                <FaTrashAlt className="color-danger"/>
                                            </a>
                                            <ReactTooltip id="tip-delete" effect="solid">Deletar</ReactTooltip>
                                        </td>
                                    </tr>
                                )) ||
                                <tr>
                                    <td colSpan={6}>
                                        Nenhum nível encontrado. <Link href='level/0'><a>Adicionar um novo?</a></Link>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Shell>
    );
}

export default DevList;

