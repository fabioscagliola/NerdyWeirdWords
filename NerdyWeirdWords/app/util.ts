export const isAuthorized = async (jsonWebToken: string) => {
    // TODO: Handle exceptions
    const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Person/IsAuthorized`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${jsonWebToken}`},
    });
    return response.ok;
}

export function validateForm(
    title: string | null | undefined,
    writing: File | string | null | undefined,
    allowedExtensions: string[]
): void {
    const normalizedTitle = (title ?? "").trim();
    if (!normalizedTitle) {
        throw new Error("You must indicate a title!");
    }

    if (!(writing instanceof File)) {
        throw new Error("You must upload a file!");
    }

    const fileName = writing.name.toLowerCase();
    const isAllowed = allowedExtensions.some((ext) =>
        fileName.endsWith(ext.toLowerCase())
    );

    if (!isAllowed) {
        throw new Error(
            `The file type must be one of: ${allowedExtensions.join(", ")}`
        );
    }
}

