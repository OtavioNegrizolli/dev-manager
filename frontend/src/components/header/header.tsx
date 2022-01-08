import { route } from 'next/dist/server/router';
import Link from 'next/link';
import styles from './header.module.css';

const sections = [
    {
        title: 'Nível',
        routes: [
            { name: 'Novo', link: '/nivel/0' },
            { name: 'Lista', link: '/nivel' }
        ]
    },
    {
        title: 'Desenvolvedores',
        routes: [
            { name: 'Novo Dev', link: '/dev/0' },
            { name: 'Lista', link: '/dev' }
        ]
    }
];

export const Header = (props: { title: string }) => {
    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <div className='d-flex align-items-center'>
                    <Link href="/">
                        <h1 className={styles.logo}>
                            <img
                                loading="lazy"
                                alt="a ramdom logo image"
                                aria-label="Logo"
                                src="https://picsum.photos/200/300"></img>
                        </h1>
                    </Link>
                    <h1 className='h4 mx-4 title'>{props.title}</h1>
                </div>
                <nav className={styles.nav}>
                    {
                        sections.map( (s, i) => {
                            return (
                                <div key={i} className={styles.menu}>
                                    <label>{s.title}</label>
                                    <ul>
                                        {
                                            s.routes.map( (r, i) => {
                                                return (
                                                    <li key={i}>
                                                        <Link href={r.link}><label>{r.name}</label></Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            );
                        })
                    }
                </nav>
            </div>
        </header>
    )
}
