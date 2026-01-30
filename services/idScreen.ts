interface IFetchIdScreenData {
  idNumber: string;
  token: string;
  setUserData: (data: any) => void;
  navigation: any;
}

export async function fetchIdScreenData({ idNumber, token, setUserData, navigation }: IFetchIdScreenData) {
  console.log("[ID_SERVICE] Starting fetchIdScreenData for ID:", idNumber);
  try {
    const [photoExist] = await Promise.all([
      fetchArmaturaData(idNumber, token, setUserData)
    ]);
    console.log("[ID_SERVICE] Data fetch finished. Photo exists:", !!photoExist);
    if (photoExist) {
      console.log("[ID_SERVICE] Navigating to 'ID' screen");
      navigation.navigate("ID");
    } else {
      console.log("[ID_SERVICE] Navigating to 'Welcome' screen");
      navigation.navigate("Welcome");
    }
  } catch (error) {
    console.error("[ID_SERVICE] FATAL ERROR in fetchIdScreenData:", error);
    throw new Error("Error al acceder a los datos para mostrar QR: " + error);
  }
}

import { apiFetch } from '../util/api';

async function fetchArmaturaData(idNumber: string, token: string, setUserData: (data: any) => void) {
  console.log("[ID_SERVICE] Calling /armatura/data endpoint...");
  return apiFetch(`/armatura/${idNumber}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  )
    .then((data) => data.text())
    .then((text) => {
      console.log("[ID_SERVICE] Response received (length):", text.length);
      const data = JSON.parse(text);
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data
        }
      }))
      console.log("[ID_SERVICE] Parsed data successfully. personPhoto exists:", !!data?.personPhoto);
      return data?.personPhoto;
    })
    .catch((err) => {
      console.error("[ID_SERVICE] ERROR in fetchArmaturaData:", err);
      return null;
    });
}
