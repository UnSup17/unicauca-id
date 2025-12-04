const BASE_URL = "https://backend.unicauca.edu.co/unid";

export async function checkObservation(idNumber: string) {
  try {
    const response = await fetch(`${BASE_URL}/admin/observations/identificacion/${idNumber}`, {
      headers: {
        'X-Unicaucaid-Key': 'CONTACTO55SECRETKEY;)',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Assuming the endpoint returns the observation object directly or null/empty if none
      // Adjust based on actual API response structure if needed. 
      // If it returns a list, take the first one? The prompt says "if data is retrieval".
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error checking observation:", error);
    return null;
  }
}

export async function deleteObservation(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/admin/observations/${id}`, {
      method: "DELETE",
      headers: {
        'X-Unicaucaid-Key': 'CONTACTO55SECRETKEY;)',
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting observation:", error);
    return false;
  }
}
