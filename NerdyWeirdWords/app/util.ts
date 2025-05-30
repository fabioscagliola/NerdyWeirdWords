export const isAuthorized = async (jsonWebToken: string) => {
    // TODO: Handle exceptions
    const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/Person/IsAuthorized`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${jsonWebToken}`},
    });
    return response.ok;
}

