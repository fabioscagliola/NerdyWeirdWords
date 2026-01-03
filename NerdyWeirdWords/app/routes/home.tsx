export default function Home() {
    return (
        <main className="container">
            <nav className="navbar">
                <div></div>
                <div className="d-flex">
                    <a className="btn btn-light" href="/signin">Sign in</a>
                </div>
            </nav>
            <div className="mb-5 text-center">
                <img alt="" className="my-5" src="/logo.svg" width="320" height="320"/>
                <h1>/nerdy|weird|words/</h1>
            </div>
            <div className="col-10 col-lg-5 mx-auto my-5 p-3 text-bg-light fs-5">
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
                <p>A place where writers share their work with beta readers, gather feedback, and engage with them.</p>
                <p>Still in development. Open source. <a href="https://github.com/fabioscagliola/NerdyWeirdWords" target="_blank">Here</a> you can find the code and roadmap.</p>
                <p>The name, the slogan, and their stylization are inspired by regular expressions, a tool software developers use to match patterns in text. I was playing with a pattern that could match both <i>weird</i> and <i>words</i>, and, being the nerd I am, I threw that into the mix too.</p>
                <p>The logo represents two brain halves—the right one flipped upside down—both resembling clouds, because this space thrives on imagination and lives in the cloud.</p>
                <p>I created this because I’ve recently published my first novel, and I wanted to share it with beta readers in a meaningful, interactive way. And no existing platform felt quite right.</p>
                <p>Nerdy Weird Words was featured in the JetBrains blog article <a href="https://blog.jetbrains.com/dotnet/2025/12/03/5-stories-of-developers-using-jetbrains-rider/">5 Stories Of Developers Using JetBrains Rider to Create, Collaborate, and Have Fun</a>.
                </p>
            </div>
            <div className="my-5 text-center">
                <p className="text-muted">Copyright 2025 <a href="https://fabioscagliola.com" target="_blank">Fabio Scagliola</a>. All rights reserved.</p>
            </div>
        </main>
    );
}

