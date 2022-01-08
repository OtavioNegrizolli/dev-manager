import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Shell from "../../components/shell/shell";
import { LevelService } from "../../services/level.service";
import styles from '../../styles/nivel/nivel.module.css';

const NivelForm: NextPage = () => {
    const { query, push: navigate } = useRouter();

    const nameInputRef = useRef<HTMLInputElement>(null);
    const [levelId, setLevelId] = useState(0);

    function setName(name: string = '') {
        if (nameInputRef.current)
            nameInputRef.current.value = name;
    }

    useEffect( () => {
        const id = query['nid'];
        if (id) {
            setLevelId(parseInt(id.toString(), 10));
        }
    },[query]);

    useEffect( () => {
        if (levelId > 0)
        {
            LevelService.get(levelId).then( data =>
            {
                setName(data.name);
            })
            .catch((e) => {
                const { response: { data, status } } = e;
                Swal.fire(
                    status < 500? 'Aviso!': '',
                    data.message || data.error,
                    status < 500?  'warning' : 'error'
                ).then( () => {
                    if (status < 500) setLevelId(0);
                });

            });
        }
        else
            setName();
    }, [levelId]);

    const onSubmit =  useCallback((e: FormEvent) => {
        e.preventDefault();

        const name = nameInputRef.current?.value;

        if ( !name || name.length === 0)
            Swal.fire('Aviso!', 'O nome é obrigatorio!', 'warning');
        else if (levelId > 0)
        {
            LevelService.patch(levelId, { name }).then(() =>
            {
                toast.success('Os dados foram atualizados com sucesso!');
                navigate('/nivel/0');
            })
            .catch( e => {
                const { response: { status, data } } = e;
                Swal.fire(
                    status >= 500? 'Erro!' : 'Aviso!',
                    data.message || data.error || data,
                    status >= 500? 'error' : 'warning',
                );
            });
        }
        else
        {
            LevelService.post({ name }).then(() => {
                toast.success('Cadastrado com sucesso!');
                setName();
                navigate('/nivel/0');
            }).catch( e => {
                const { response: { status, data } } = e;
                Swal.fire(
                    status >= 500? 'Erro!' : 'Aviso!',
                    data.message || data.error || data,
                    status >= 500? 'error' : 'warning',
                )
            });
        }
    }, [nameInputRef]);


    return (
        <Shell title="Nível">
            <form onSubmit={onSubmit} className={styles.form + 'card card-body w-100'}>
                <div className="row">
                    <div className="col form-group">
                        <label htmlFor="name">Nome/Descrição: </label>
                        <input
                            id="name"
                            className="form-control"
                            type="text"
                            ref={nameInputRef}
                            placeholder="Nome do nível"
                            required maxLength={100}
                        />
                    </div>
                </div>
                <div className="row justify-content-center pt-4">
                    <div className="col-5 col-md-3 ">
                        <Button type="submit" className="w-100">Salvar</Button>
                    </div>
                    <div className="col-5 col-md-3 ">
                        <Link href="/nivel/0" >
                            <button
                                type="reset"
                                onClick={() => setName()}
                                className="btn btn-outline-danger w-100"
                            >
                                Cancelar
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </Shell>
    );
}

export default NivelForm;


