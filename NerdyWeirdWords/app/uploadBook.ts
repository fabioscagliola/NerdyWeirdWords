export async function uploadBook(
  title: string,
  description: string,
  writing: File
): Promise<any> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", writing);

  const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Book`, {
    method: "POST",
    body: formData,
  });

  if (response.status === 400) {
    throw new Error("400: Bad request");
  }

  if (response.status === 500) {
    throw new Error("500: Server error");
  }

  if (!response.ok) {
    throw new Error(`${response.status}: Unexpected error`);
  }

  return response.json();
}