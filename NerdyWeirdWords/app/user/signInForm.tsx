export default function SignInForm() {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        throw new Error(`Email "${email}" not found.`);
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
            <form className="col-10 col-lg-5 mx-auto my-5" action={submit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email"/>
                </div>
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary d-flex">Go</button>
                </div>
                <div className="alert alert-danger">Something went wrong...</div>
            </form>
        </main>
    );
}

