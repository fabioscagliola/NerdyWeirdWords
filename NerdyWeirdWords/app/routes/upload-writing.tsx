import React, { useState } from "react";

interface WritingData {
  writing?: File;
  title?: string;
  description?: string;
}

const allowedExtensions = ["md"];
async function postWriting(data: WritingData): Promise<string | null> {
  if (!data.writing || data.writing.size === 0) {
    return "You must indicate a file!";
  }

  const extension = data.writing.name
    .substring(data.writing.name.lastIndexOf(".") + 1)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return `Invalid file type! Supported file types: ${allowedExtensions.join(", ")}`;
  }

  if (!data.title || !data.title.trim()) {
    return "You must indicate a title!";
  }

  try {
    const formData = new FormData();
    formData.append("writing", data.writing);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);

    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/?/?`, { // wich endpoint?
      method: "POST",
      body: formData, 
    });

    if (!res.ok) {
      const errorText = await res.text();
      return ` Upload failed: ${errorText}`;
    }

    return null;
  } catch (err: any) {
    console.error("Upload error:", err);
    return "An unexpected error occurred during upload.";
  }
}

export default function UploadWriting() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      writing: formData.get("writing") as File,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const error = await postWriting(data);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setSuccessMessage("Writing uploaded successfully!");
      event.currentTarget?.reset();// cosa fa ??
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
        <h1>Upload writing</h1>
        <p>Pick a file, give it a title, optionally a description, and upload your writing.</p>
      </div>

      <form
        className="col-10 col-lg-5 mx-auto my-5"
        encType="multipart/form-data"
        noValidate
        onSubmit={handleClick}
      >
        <div className="mb-3">
          <label htmlFor="writing" className="form-label">
            Writing
          </label>
          <input type="file" className="form-control" id="writing" name="writing" />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input type="text" className="form-control" id="title" name="title" />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea className="form-control" id="description" name="description" />
        </div>

        <button type="submit" className="btn btn-primary d-flex" disabled={loading}>Upload Writing</button>

        {errorMessage && (
         <div className="alert alert-danger">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
      </form>
    </main>
  );
}
