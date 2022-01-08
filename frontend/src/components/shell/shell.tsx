import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";

import styles from './shell.module.css';


const Shell: React.FC<{title: string}> = ({ title, children }) =>
{
    return (
        <>
            <Header title={title}/>
            <div className={styles.container}>
                <Sidebar/>
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </>
    );
}

export default Shell;
