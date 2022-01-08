import Link from 'next/link';
import styles from './sidebar.module.css';

const sections = [
    {
        title: 'Nivel',
        routes: [
            { name: 'Novo Nivel', link: '/nivel/0' },
            { name: 'Lista', link: '/nivel' }
        ]
    }
]

export const Sidebar = () => {
    return (
        <section className={styles.sidebar}>
                {
                    sections.map( (s, i) => {
                        return (
                            <div className={styles.moduleLinks} key={i}>
                                <h1>{s.title}</h1>
                                <ul>
                                {
                                    s.routes.map( (route, i) => {
                                        return (
                                            <li key={i}>
                                                <Link href={route.link}>
                                                    <a href="#">{route.name}</a>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                                </ul>
                            </div>
                        )
                    })
                }
            {/* <div>
                <h1>Desenvolvedores</h1>
                <ul>
                    <li>
                        <Link href={'/dev'}/>
                    </li>
                    <li>
                        <Link></Link>
                    </li>
                </ul>
            </div> */}
        </section>
    );
};
