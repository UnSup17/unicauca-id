import { CameraCapturedPicture } from "expo-camera";

interface ITryPostProfilePhoto {
  photo: CameraCapturedPicture,
  armaturaData: string,
  token: string,
  setUserData: (data: any) => void
}

export async function tryPostProfilePhoto({ photo, armaturaData, token, setUserData }: ITryPostProfilePhoto) {
  const data = JSON.parse(armaturaData);
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
    .then((json) => {
      setUserData((prev: any) => ({
        ...prev,
        currentUser: {
          ...prev.currentUser,
          data: json.data
        }
      }));
      return true;
    })
    .catch(() => false);

}