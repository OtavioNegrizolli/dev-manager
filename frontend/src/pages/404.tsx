import type { NextPage } from "next";
import Shell from "../components/shell/shell";

const ErrorPage: NextPage = () => {
    return (
        <Shell title="Perdido?">
            <div className="text-center pt-5">
                <h2 className="h2 title">
                    Parece que esta página não existe!
                </h2>
                <h3 className="title text-muted">
                    Não mais!
                </h3>
            </div>
        </Shell>
    )
}
export default ErrorPage;
