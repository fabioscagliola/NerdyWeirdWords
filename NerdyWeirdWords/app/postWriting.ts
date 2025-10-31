
export interface WritingData {
  writing?: File;
  title?: string;
  description?: string;
}

const allowedExtensions = ["md"];

export async function postWriting(data: WritingData): Promise<string | null> {
  // --- VALIDATION ---
  if (!data.writing || data.writing.size === 0) {
    return "400 : You must indicate a file!";
  }

  const extension = data.writing.name
    .substring(data.writing.name.lastIndexOf(".") + 1)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return ` 400 : Invalid file type! Supported file types: ${allowedExtensions.join(", ")}`;
  }

  if (!data.title || !data.title.trim()) {
    return "400 : You must indicate a title!";
  }

  // --- UPLOAD ---
  try {
    const formData = new FormData();
    formData.append("writing", data.writing);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return ` 500 : Upload failed: ${errorText}`;
    }

    return null; // Success
  } catch (err: any) {
    console.error("Upload error:", err);
    return "An unexpected error occurred during upload.";
  }
}
