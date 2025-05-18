export default function SignInForm() {
    return (
        <main className="container">
            <nav className="navbar navbar">
                <div className="navbar-brand">
                    <img alt="" src="/logo.svg" width="32" height="32"/>
                </div>
            </nav>
            <form className="col-4 mx-auto my-5" method="post" action="/signin">
                <div className="mb-2">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email"/>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
        </main>
    );
}

