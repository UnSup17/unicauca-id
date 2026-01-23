interface IFetchIdScreenData {
  idNumber: string;
  token: string;
  setUserData: (data: any) => void;
  navigation: any;
}

export async function fetchIdScreenData({ idNumber, token, setUserData, navigation }: IFetchIdScreenData) {
  try {
    const [photoExist] = await Promise.all([
      fetchArmaturaData(idNumber, token, setUserData)
    ]);
    if (photoExist) {
      navigation.navigate("ID");
    } else {
      navigation.navigate("Welcome");
    }
  } catch (error) {
    throw new Error("Error al acceder a los datos para mostrar QR: " + error);
  }
}

import { apiFetch } from '../util/api';

async function fetchArmaturaData(idNumber: string, token: string, setUserData: (data: any) => void) {
  return apiFetch(`/armatura/${idNumber}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  )
    .then((data) => data.text())
    .then((text) => {
      const data = JSON.parse(text);
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data
        }
      }))
      return data?.personPhoto;
    })
    .catch(() => null);
}
