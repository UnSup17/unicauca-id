import { ImageResult } from "expo-image-manipulator";
import { Alert } from "react-native";
import { apiFetch } from "../util/api";

interface ITryPostProfilePhoto {
  photo: ImageResult,
  data: any,
  type: "jpg" | "png",
  token: string,
  setUserData: (data: any) => void
}

export async function tryPostProfilePhoto({ photo, data, token, type, setUserData }: ITryPostProfilePhoto) {
  const validPhotoResponse = await fetchisValidPhoto({ photo, token, type })
  if (!validPhotoResponse.isValidPhoto) {
    let messages = "";
    validPhotoResponse.statuses.forEach((item: any) => {
      if (!item.valid) {
        messages += item.message + "\n";
      }
    });
    Alert.alert("Foto no válida, razones:", messages);
    return false;
  }

  data.personPhoto = photo.base64;
  const postPhotoResult = await fetchPostPhoto({ data, setUserData, token });
  return postPhotoResult;
}

interface IFetchIsValidPhoto {
  photo: ImageResult,
  token: string,
  type: "jpg" | "png"
}
async function fetchisValidPhoto({ photo, token, type }: IFetchIsValidPhoto) {
  const aux = new FormData();

  const auxType = type === "jpg"
    ? { name: "photo.jpg", type: "image/jpeg" }
    : { name: "photo.png", type: "image/png" };

  aux.append("image", {
    uri: photo.uri,
    name: auxType.name,
    type: auxType.type,
  } as any);

  return apiFetch(`/faces/detect`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: aux,
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error("Error en el servidor al validar la foto, comuníquese con contacto@unicauca.edu.co");
    })
    .catch((err: any) => {
      throw new Error("Error validando foto: " + err.message);
    });
}

interface IFetchPostPhoto {
  token: string,
  data: any,
  setUserData: (data: any) => void
}
async function fetchPostPhoto({ data, setUserData, token }: IFetchPostPhoto) {
  return apiFetch(`/armatura/update`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((res) => res.json())
    .then(() => {
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data
        }
      }));
      return true;
    })
    .catch((err: any) => { throw new Error("Error cargando foto " + err.message) })
}