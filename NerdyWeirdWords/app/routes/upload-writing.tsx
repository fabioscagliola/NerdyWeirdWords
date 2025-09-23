export default function UploadWriting() {
  function handleClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="container">
      <h1 className="my-5 text-center">Upload writing</h1>
      <form
        className="col-10 col-lg-5 mx-auto my-5"
        encType="multipart/form-data"
        onSubmit={handleClick}
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Writing</label>
          <input
            type="file"
            className="form-control"
            id="content"
            name="content"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </main>
  );
}
