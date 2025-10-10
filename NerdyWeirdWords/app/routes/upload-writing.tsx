import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {validateForm} from "~/util";

interface FormDataPreview {
  title: string;
  description: string;
  writing: File;
}

const ALLOWED_EXTENSIONS = [".md"];

function UploadCheck() {
    const [formData, setFormData] = useState<FormDataPreview | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      
      const form = event.currentTarget.form;
      if (!form) {
          setErrorMessage("Form not found");
          return;
      }
      
      try {
          setErrorMessage(null);
          setSuccessMessage("Upload in progress…");

          const data = new FormData(form);
          const title = data.get("title")?.toString() ?? "";
          const description = data.get("description")?.toString() ?? "";
          const writing = data.get("content");
          
          validateForm(title, writing, ALLOWED_EXTENSIONS);
          
          setFormData({ title: title.trim(), description, writing: writing as File });
          setSuccessMessage("File accepted for upload!");
      } catch (err: unknown) {
          if (err instanceof Error) {
              setErrorMessage(err.message);
          } else {
              setErrorMessage("Something went wrong!");
          }
      }
  };
  
  return (
    <>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
    </>
  );
}

export default UploadCheck;