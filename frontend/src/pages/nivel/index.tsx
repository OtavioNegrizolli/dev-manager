import { FormEvent, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Shell from "../../components/shell/shell";
import { Level } from "../../model/level.dto";
import { FaPen, FaSearch, FaTrashAlt, FaArrowDown, FaArrowUp, FaArrowsAltV } from 'react-icons/fa';
import Link from "next/link";
import { useCallback } from "react";
import ReactTooltip from "react-tooltip";

import styles from '../../styles/list.module.css';
import { toast } from "react-toastify";
import { LevelService } from "../../services/level.service";


const LevelList = () =>
{
    const [levels, setLevels] = useState<Level[] | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [orderBy, setOrderBy] = useState<'id' | 'name' | 'developers'>('id');
    const [asc, setAsc] = useState<boolean>(true);

    const onSubmit = useCallback(( e?: FormEvent) => {
        e?.preventDefault();
        const params = { orderBy, asc:`${asc}` };
        const name =  nameInputRef.current?.value;
        if ( name ) Object.assign(params, { name });
        LevelService
            .list({ ...params, orderBy, asc: asc? 'true':'false' })
            .then( setLevels );
    }, [orderBy, asc]);

    function toggleOrderBy(col: 'id' | 'name' | 'developers' ) {
        if ( col === orderBy )
            setAsc(!asc);
        else
        {
            setOrderBy(col);
            setAsc(true);
        }
    }

    function getOrderByIcon(col: 'id' | 'name' | 'developers' ) {
        return orderBy === col? (asc? <FaArrowDown/> : <FaArrowUp/>) : <FaArrowsAltV/>;
    }

    useEffect(() => {
        onSubmit();
    }, [orderBy,asc]);

    const onDelete = useCallback((id: number) => {
        const toDelete = levels?.find( l => l.id == id);
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
                LevelService.delete(id).then( () => {
                    toast.success('Excluido com sucesso!');
                    onSubmit();
                })
                .catch( e =>{
                    if ( e )
                    {
                        const { response: { status, data } } = e;
                        if ( status === 503 ) {
                            Swal.fire(
                                'Aviso!',
                                data.message || data.error || data,
                                'warning'
                            );
                        }
                    }
                });
            }
        });
    }, [levels]);

    return (
        <Shell title="Níveis">
            <div className="card pb-4 justify-content-center">
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                            <div className="row">
                                <div className="col form-control">
                                    <label htmlFor="nome">Nome</label>
                                    <input ref={nameInputRef} type="text" id="nome" className="form-control" />
                                </div>
                                <div className="col-1 d-flex align-items-center">
                                    <button type="submit"className="btn btn-primary" style={{flexGrow:0}}>
                                        <FaSearch />
                                    </button>
                                </div>
                            </div>
                    </form>
                </div>
            </div>

            <div className="card mt-4">
                <div className="table-responsive w-100">
                    <table className="table table-striped table-hover">
                        <thead className={styles.thead}>
                            <th scope="col" onClick={() => toggleOrderBy('id')}>
                                <div>Id {getOrderByIcon('id')}</div>
                            </th>
                            <th scope="col" onClick={() => toggleOrderBy('name')}>
                                <div>Nome{getOrderByIcon('name')}</div>
                            </th>
                            <th scope="col">
                                <div>Num. Devs{getOrderByIcon('developers')}</div>
                            </th>
                            <th scope="col"></th>
                        </thead>
                        <tbody className={styles.tbody}>
                            {
                                levels?.map( (level, i) => (
                                    <tr key={level.name}>
                                        <th scope="row">{level.id}</th>
                                        <td>{level.name}</td>
                                        <td>{level.totalDevelopers}</td>
                                        <td className={styles.actions} width='15%'>
                                            <Link href={`/nivel/${level.id}`}>
                                                <a data-for="tip-edit" data-tip="Editar" role="button">
                                                    <FaPen className="color-secondary"/>
                                                </a>
                                            </Link>
                                            <ReactTooltip id="tip-edit" effect="solid">Editar</ReactTooltip>
                                            <a data-for="tip-delete" data-tip="Deletar" role="button" onClick={() => onDelete(level.id)}>
                                                <FaTrashAlt className="color-danger"/>
                                            </a>
                                            <ReactTooltip id="tip-delete" effect="solid">Deletar</ReactTooltip>
                                        </td>
                                    </tr>
                                )) ||
                                <tr>
                                    <td colSpan={3}>
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

export default LevelList;

