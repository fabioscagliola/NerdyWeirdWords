import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';


interface FormDataPreview {
  title: string;
  description: string;
  file: File | null;
}

function UploadCheck() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormDataPreview | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<string>("danger");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setErrorMessage("Upload in Progress"); // Informs the user that the upload is in progress
    // Validation

    if (!title.trim()) {
      setErrorMessage("You must indicate a title!");
      setAlertVariant("warning");
      return;
    }

    if (!file) {
      setErrorMessage("Devi selezionare un file .md!");
      setAlertVariant("warning");
      return;
    }

    if (!file.name.endsWith(".md")) {
      setErrorMessage("The file must be .md");
      setAlertVariant("warning");
      return;
    }
    // everithing works → save data

    const data: FormDataPreview = { title, description, file };
    setFormData(data);
    console.log("Form data:", data);
    
    setErrorMessage("File accepted for upload!");
    setAlertVariant("success");
  };

  return (
    <>
      <form method="post">
        <h1>Upload your book</h1>

        <input
          type="text"
          maxLength={30}
          placeholder="Book title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          maxLength={100}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <input
          data-testid="file"
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />

        <button onClick={handleClick}>Upload</button>
      </form>

             {errorMessage && (
          <Alert variant={alertVariant} dismissible onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
    </>
  );
}

export default UploadCheck;