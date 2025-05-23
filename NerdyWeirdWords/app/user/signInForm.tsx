import {useState} from "react";

export default function SignInForm() {
    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const [linkSent, setLinkSent] = useState<boolean>(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setLinkSent(false);
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
            setLinkSent(true);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e);
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
                {errorMessage ? (
                    <div className="alert alert-danger">{errorMessage}</div>
                ) : linkSent ? (
                    <div className="alert alert-success">Link sent!</div>
                ) : null}
            </form>
        </main>
    );
}

