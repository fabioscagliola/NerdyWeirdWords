import {useEffect, useState,} from "react";
import {useNavigate, useParams,} from "react-router";
import {isAuthorized} from "~/util";

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        (async () => {
            const cookieName = "jsonWebToken";
            const target = "/main";
            const jsonWebToken = document.cookie
                .split("; ")
                .find(item => item.startsWith(`${cookieName}=`))
                ?.split("=")[1];
            if (jsonWebToken) {
                console.log("JWT found in cookie.");
                if (await isAuthorized(jsonWebToken)) {
                    console.log("Valid JWT found in cookie.");
                    navigate(target);
                    return;
                } else {
                    console.log("Invalid JWT found in cookie.");
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            }
            if (params.jsonWebToken) {
                console.log("JWT found in URL.");
                if (await isAuthorized(params.jsonWebToken)) {
                    console.log("Valid JWT found in URL.");
                    document.cookie = `${cookieName}=${params.jsonWebToken}`;
                    navigate(target);
                    return;
                } else {
                    console.log("Invalid JWT found in URL.");
                }
            } else {
                console.log("JWT not found in URL.");
            }
        })();
    }, [navigate, params.jsonWebToken]);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email")?.toString().trim();
            if (!email) {
                throw new Error("Where's the email?");
            }
            const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Person/SendSignInLink`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email})
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            setSuccessMessage("Link sent!");
        } catch (e: unknown) {
            if (e instanceof Error && e.message) {
                setErrorMessage(e.message);
            } else {
                setErrorMessage("Something's wrong!");
            }
        }
    }

    return (
        <main className="container">
            <nav className="navbar navbar">
                <div className="navbar-brand">
                    <img alt="" src="/logo.svg" width="32" height="32"/>
                </div>
            </nav>
            <div className="my-5 text-center">
                <h1>Sign in</h1>
                <p>Remind us of your email and we’ll send you a link.</p>
            </div>
            <form className="col-10 col-lg-5 mx-auto my-5" noValidate onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email"/>
                </div>
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary d-flex">Go</button>
                </div>
                {errorMessage && (
                    <div className="alert alert-danger mt-3">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="alert alert-success mt-3">{successMessage}</div>
                )}
            </form>
        </main>
    );
}

