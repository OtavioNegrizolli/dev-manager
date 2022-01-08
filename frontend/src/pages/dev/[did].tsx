import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import { DeveloperService } from "../../services/dev.service";
import Shell from "../../components/shell/shell";

import styles from '../../styles/dev.module.css';
import { LevelService } from "../../services/level.service";

const genders: SelectModel[] = [{label: 'Masculino', value: 'm'}, {label: 'Feminino', value: 'f'}];
interface SelectModel {value: number | string, label: string}


const DeveloperForm = ( ) => {
    const [levels, setLevels] = useState<SelectModel[]>([]);

    const { query, push: navigate } = useRouter();

    const [ devId, setDevId] = useState<number>(0);
    const [ birthDate, setBirthDate] = useState<Date|null>(new Date());
    const [ level, setLevel] = useState<SelectModel>();
    const [ gender, setGender] = useState<SelectModel|null>();

    const nameInputRef = useRef<HTMLInputElement>(null);
    const hobbyInputRef = useRef<HTMLTextAreaElement>(null);

    function setName(name: string = '') {
        if (nameInputRef.current)
            nameInputRef.current.value = name;
    }

    function setHobby(name: string = '') {
        if (hobbyInputRef.current)
            hobbyInputRef.current.value = name;
    }

    function loadLevels() {
        LevelService.list({ orderBy: 'name', asc: 'true', take: -1 })
        .then((d) => {
            if (d)
            {
                const _l = d.map( l => ({ value: l.id, label: l.name }));
                setLevels(_l);
            }
        });
    }
    useEffect(()=>{
        loadLevels()
        const id = query['did'] || '0';
        setDevId(+id);
    },[]);

    useEffect( () => {
        const id = query['did'] || '0';
        setDevId(+id);
    },[query]);

    useEffect( () => {
        if (devId > 0)
        {
            DeveloperService.get(devId).then( data =>
            {
                console.warn(data);

                setName(data.name);
                setGender(genders.find( g => g.value == data.gender));
                setHobby(data.hobby);
                setLevel({ value: data.level_id, label: data.level });
                setBirthDate(new Date(data.birthDate));
            })
            .catch((e) => {
                const { response: { data, status } } = e;
                Swal.fire(
                    status < 500? 'Aviso!': '',
                    data.message || data.error,
                    status < 500?  'warning' : 'error'
                ).then( () => {
                    if (status < 500) setDevId(0);
                });

            });
        }
        else {
            setName();
            setBirthDate(new Date());
            setLevel(undefined);
            setGender(null);
            setHobby();
        }
    }, [devId, nameInputRef, hobbyInputRef]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const name = nameInputRef.current?.value;
        let hobby = hobbyInputRef.current?.value;
        console.log(birthDate, new Date());

        if (hobby)
        {
            hobby = hobby.trim();
            if (hobby.length > 1000)
                Swal.fire('Aviso! Muitos hobbies!', 'o limite máximo é 1000 caracters!', 'warning');
            else if (hobby.length === 0)
                hobby = undefined;
        }
        console.log(level, level == null);

        if ( !name || name.length === 0 )
            Swal.fire('Aviso!', 'O nome é obrigatorio!', 'warning');
        if ( !name || name.length > 100 )
            Swal.fire('Aviso!', 'Nome muito longo!', 'warning');
        else if ( birthDate == null )
            Swal.fire('Aviso!', 'A data de é obrigatoria!', 'warning');
        else if ( birthDate > new Date())
            Swal.fire('Aviso! Data de nasc inválida', 'O deve precisa ter nascido ao menos!', 'warning');
        else if ( level == null)
            Swal.fire('Aviso!', 'Você precisa selecionar o nível', 'warning');
        else if ( gender == null )
            Swal.fire('Aviso!', 'Você precisa selecionar o sexo!', 'warning');
        else if (devId > 0)
        {
            DeveloperService.patch(devId, { name, birthDate, level: +level.value, gender: ''+gender.value, hobby }).then(() =>
            {
                toast.success('Os dados foram atualizados com sucesso!');
                navigate('/dev/0');
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
            DeveloperService.post({ name, birthDate, level: +level.value, gender: ''+gender.value,  hobby }).then(() => {
                toast.success('Cadastrado com sucesso!');
                setName();
                setBirthDate(new Date());
                setLevel(undefined);
                setGender(null);
                setHobby();
                navigate('/dev/0');
            }).catch( e => {
                const { response: { status, data } } = e;
                Swal.fire(
                    status >= 500? 'Erro!' : 'Aviso!',
                    data.message || data.error || data,
                    status >= 500? 'error' : 'warning',
                )
            });
        }
    }

    return (
        <Shell title="Desenvolvedor">
            <form onSubmit={onSubmit} className='card card-body w-100'>
                <div className="row align-items-center">
                    <div className="col form-group pt-2">
                        <label htmlFor="name">Nome</label>
                        <input
                            id="name"
                            className="form-control"
                            type="text"
                            ref={nameInputRef}
                            placeholder="Nome do desenvolvedor"
                            required maxLength={100}
                        />
                    </div>
                    <div className="col form-group mb-0">
                        <label htmlFor="birth">Data de nascimento</label>
                        <ReactDatePicker
                            selected={birthDate}
                            onChange={(d) =>{console.log(d);setBirthDate(d)}}
                            id="birth"
                            className="form-control mb-0"
                        />
                    </div>
                </div>
                <div className="row pt-2">
                    <div className="col form-group">
                        <label htmlFor="level">Nível</label>
                        <Select
                            id="level"
                            options={levels}
                            onChange={(l) => {console.log(l);
                            setLevel(l as { value: number, label: string})}}
                            value={level}
                            className="form-control p-0"
                        />
                    </div>
                    <div className="col form-group">
                        <label htmlFor="gender">Sexo</label>
                        <Select
                            id='gender'
                            className="form-control p-0"
                            onChange={(v) => setGender(v)}
                            options={genders}
                            value={gender}
                        />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 form-group">
                        <label htmlFor="hobby">Hobby</label>
                        <textarea id="hobby" cols={10} rows={15} className={styles.textarea + " form-control"} ref={hobbyInputRef} maxLength={1000}></textarea>
                    </div>
                </div>
                <div className="row justify-content-center pt-4">
                    <div className="col-5 col-md-3 ">
                        <button type="submit" className="btn btn-primary w-100">Salvar</button>
                    </div>
                    <div className="col-5 col-md-3 ">
                        <Link href="/dev/0" >
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
};

export default DeveloperForm;
