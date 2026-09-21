import { useEffect, useState, } from "react";
import { useNavigate, } from "react-router";
import { isAuthorized } from "~/util";

type WritingListItem = {
    id: string;
    title: string;
    description: string | null;
    dateUploaded: string;
};

export default function Main() {
    const navigate = useNavigate();
    const [writings, setWritings] = useState<WritingListItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const cookieName = "jsonWebToken";
                const target = "/signin";
                const jsonWebToken = document.cookie
                    .split("; ")
                    .find(item => item.startsWith(`${cookieName}=`))
                    ?.split("=")[1];
                if (jsonWebToken) {
                    console.log("JWT found in cookie.");
                    if (await isAuthorized(jsonWebToken)) {
                        console.log("Valid JWT found in cookie.");
                        const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Writing/List`, {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${jsonWebToken}` },
                        });
                        if (!response.ok) {
                            throw new Error(await response.text());
                        }
                        setWritings(await response.json() as WritingListItem[]);
                    } else {
                        console.log("Invalid JWT found in cookie.");
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        navigate(target);
                        return;
                    }
                } else {
                    console.log("JWT not found.");
                    navigate(target);
                    return;
                }
            } catch (e: unknown) {
                setErrorMessage(e instanceof Error && e.message ? e.message : "Something's wrong!");
            }
        })();
    }, [navigate]);

    return (
        <main className="container">
            <nav className="navbar navbar">
                <div className="navbar-brand">
                    <img alt="" src="/logo.svg" width="32" height="32" />
                </div>
            </nav>
            <section className="my-5 text-center">
                <h1>My writings</h1>
                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}
                {!errorMessage && writings.length === 0 && (
                    <p>You haven't uploaded any writing yet.</p>
                )}
                {writings.length !== 0 && (
                    <div className="mb-3">
                        {writings.map((writing) => (
                            <div className="mb-3">
                                <h2>{writing.title}</h2>
                                <p>{new Date(writing.dateUploaded).toDateString()}</p>
                                {writing.description && <p>{writing.description}</p>}
                                <div className="btn-group mb-3">
                                    <a className="btn btn-primary" href={`/writings/${writing.id}/edit`}>Edit</a>
                                    <a className="btn btn-primary" href={`/writings/${writing.id}/invite`}>Invite</a>
                                    <a className="btn btn-primary" href={`/writings/${writing.id}/read`}>Read</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <a className="btn btn-primary" href="/upload-writing">Upload writing</a>
            </section>
        </main>
    );
}
