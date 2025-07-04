import { CameraCapturedPicture } from "expo-camera";
import Constants from "expo-constants";

interface ITryPostProfilePhoto {
  photo: CameraCapturedPicture,
  armaturaData: string,
  token: string,
  setUserData: (data: any) => void
}

export async function tryPostProfilePhoto({ photo, armaturaData, token, setUserData }: ITryPostProfilePhoto) {
  const data = JSON.parse(armaturaData);
  data.personPhoto = photo.base64;
  return fetch(
    `${Constants.expoConfig?.extra?.apiUrl || "http://192.168.52.65:8080/unid"}/armatura/update`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((res) => res.json())
    .then((json) => {
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data: json.data
        }
      }));
    })
    .catch((err) => console.error("Error uploading photo:", err));

}