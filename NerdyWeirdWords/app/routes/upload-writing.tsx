import { postWriting } from "../postWriting";
import React, { useState, useEffect } from "react";

export default function UploadWriting() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  async function handleClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFade(false);
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
      setSuccessMessage("200 : Writing uploaded successfully!");
      event.currentTarget?.reset(); // ✅ protezione contro null
    }
  }

  // Gestione fade-out per i messaggi di stato
  useEffect(() => {
    if (errorMessage || successMessage) {
      const fadeTimer = setTimeout(() => setFade(true), 2500); // avvia fade dopo 2.5s
      const clearTimer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setFade(false);
      }, 4000); // rimuove dopo 4s

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [errorMessage, successMessage]);

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1>Upload writing</h1>
        <p>Pick a file, give it a title, optionally a description, and upload your writing.</p>
      </div>

      <form
        className="col-10 col-lg-5 mx-auto"
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>

        {/* --- ALERTS --- */}
        {errorMessage && (
          <div
            className={`alert alert-danger mt-4 ${fade ? "fade show opacity-0" : "show opacity-100"}`}
            role="alert"
            style={{ transition: "opacity 0.5s ease" }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className={`alert alert-success mt-4 ${fade ? "fade show opacity-0" : "show opacity-100"}`}
            role="alert"
            style={{ transition: "opacity 0.5s ease" }}
          >
            {successMessage}
          </div>
        )}
      </form>
    </main>
  );
}
