import { useState} from "react";

export default function UploadWriting() {
    const [successMessage, setsuccessMessage] = useState(false);
    const [errorMessage, seterrorMessage] = useState<string | null>(null);
    const [hangOn, setHangOn] = useState(false);

    function getErrorMessage(err: unknown): string {
        return err instanceof Error ? err.message : "Unknown error occurred";
    }

    async function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setHangOn(true);
        seterrorMessage(null);
        setsuccessMessage(false);

        try {
            const formData = new FormData(event.currentTarget);
            const data = {
                writing: formData.get("writing") as File,
                title: formData.get("title") as string,
                description: formData.get("description") as string,
            };

            validate(data);

            await upload(data); 

            setsuccessMessage(true);

        } catch (err: unknown) {
            seterrorMessage(getErrorMessage(err));
        } finally {
            setHangOn(false);
        }
    }

    function validate(data: { writing?: File; title?: string; description?: string }): void {
        const allowedExtensions = ["md"];

        if (!data.writing || data.writing?.size === 0) {
            throw new Error("You must indicate a file!");
        }

        const extension = data.writing.name.substring(data.writing.name.lastIndexOf(".") + 1).toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new Error(`Invalid file type! Supported file types: ${allowedExtensions.join(", ")}`);
        }

        if (!data.title || !data.title.trim()) {
            throw new Error("You must indicate a title!");
        }
    }

    async function upload(data: { writing: File; title: string; description: string }): Promise<void> {
        const formData = new FormData();
        formData.append("writing", data.writing);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Writing/Upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Something's wrong!");
        }
    }

    if (hangOn) {
        return (
            <div className="my-5 text-center">
                <div className="spinner-border">
                    <span className="visually-hidden">Hang on...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="container">
            <div className="my-5 text-center">
                <nav className="navbar navbar">
                    <div className="navbar-brand">
                        <img alt="" src="/logo.svg" width="32" height="32" />
                    </div>
                </nav>
                <h1>Upload writing</h1>
                <p>Pick a file, give it a title, optionally a description, and upload your writing.</p>
            </div>
            <form className="col-10 col-lg-5 mx-auto my-5" encType="multipart/form-data" noValidate onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="writing" className="form-label">Writing</label>
                    <input type="file" className="form-control" id="writing" name="writing"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description"/>
                </div>
                <button type="submit" className="btn btn-primary d-flex">Upload</button>

                {errorMessage && (
                    <div className="alert alert-danger mt-3">{errorMessage}</div>
                )}

                {successMessage && (
                    <div className="alert alert-success mt-3">Uploaded!</div>
                )}
            </form>
        </main>
    );
}
