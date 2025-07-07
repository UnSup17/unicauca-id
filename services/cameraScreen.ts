import { CameraCapturedPicture } from "expo-camera";
import { Alert } from "react-native";

interface ITryPostProfilePhoto {
  photo: CameraCapturedPicture,
  data: any,
  token: string,
  setUserData: (data: any) => void
}

export async function tryPostProfilePhoto({ photo, data, token, setUserData }: ITryPostProfilePhoto) {
  data.personPhoto = photo.base64;
  return fetch(`https://backend.unicauca.edu.co/unid/armatura/update`,
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
}