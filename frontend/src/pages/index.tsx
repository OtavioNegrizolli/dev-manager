import type { NextPage } from 'next';
import Head from 'next/head';
import Shell from '../components/shell/shell';

const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>Dev App!</title>
            </Head>
            <Shell title='Home'/>
        </>
    );
}

export default Home;
