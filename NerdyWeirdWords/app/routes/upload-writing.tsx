export default function UploadWriting() {
    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <main className="container">
            <div className="my-5 text-center">
                <h1>Upload writing</h1>
                <p>Pick a file, give it a title, optionally a description, and upload your writing.</p>
            </div>
            <form className="col-10 col-lg-5 mx-auto my-5" encType="multipart/form-data" noValidate onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Writing</label>
                    <input type="file" className="form-control" id="content" name="content"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description"/>
                </div>
                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </main>
    );
}

