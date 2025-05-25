export default function Home() {
    return (
        <main className="container">
            <nav className="navbar">
                <div></div>
                <div className="d-flex">
                    <a className="btn btn-light" href="/signin">Sign in</a>
                </div>
            </nav>
            <div className="my-5 text-center">
                <img alt="" className="my-5" src="/logo.svg" width="320" height="320"/>
                <h1 className="font-monospace">/nerdy|weird|words/</h1>
            </div>
            <div className="w-50 mx-auto my-5 p-3 text-bg-light fs-5">
                <p className="font-monospace">
                    <span className="text-bg-primary">nerdy</span>
                    <span className="text-muted">&middot;</span>
                    <span>thoughts</span>
                    <span className="text-muted">&crarr;</span><br/>
                    <span>shape</span>
                    <span className="text-muted">&middot;</span>
                    <span className="text-bg-primary">weird</span>
                    <span className="text-muted">&middot;</span>
                    <span>stories</span>
                    <span className="text-muted">&crarr;</span><br/>
                    <span>into</span>
                    <span className="text-muted">&middot;</span>
                    <span>written</span>
                    <span className="text-muted">&middot;</span>
                    <span className="text-bg-primary">words</span>
                    <span className="blinking">|</span>
                </p>
            </div>
            <div className="my-5 text-center">
                <h2>What is this?</h2>
                <p>A web app for writers to share their work with beta readers, gather feedback, and engage with them.</p>
                <p>In development. Open source. Code and roadmap available <a href="https://github.com/fabioscagliola/NerdyWeirdWords" target="_blank">here</a>.</p>
                <h3>How about the logo?</h3>
                <p>Two brain halves, the right one flipped upside down. Both look like clouds because—well, of course they do.</p>
                <h3>And the slogan?</h3>
                <p></p>
                <h3>Ok, but most of all why?</h3>
                <p>Because I am about to complete my first novel, I want to share it with my beta readers in an engaging way, and I have not found a platform that does that.</p>
            </div>
            <div className="my-5 text-center">
                <p className="text-muted">Copyright 2025 <a href="https://fabioscagliola.com" target="_blank">Fabio Scagliola</a>. All rights reserved.</p>
            </div>
        </main>
    );
}

