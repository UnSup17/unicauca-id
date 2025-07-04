import { useContext } from "react";
import { Image } from "react-native";
import { UserContext } from "../../context/UserContext";

interface IPersonPhoto {
  styles: {
    user: {
      top: number;
      height: number;
      width: number;
      borderRadius: number;
    };
  };
}
export default function PersonPhoto({ styles }: IPersonPhoto) {
  const { userData } = useContext(UserContext);
  if (!userData || !userData.currentUser.data) {
    return <></>;
  }
  const personPhoto = userData.currentUser.data.personPhoto;
  return (
    <Image
      source={{ uri: "data:image/jpeg;base64," + personPhoto }}
      style={{ top: styles.user.top }}
      height={styles.user.height}
      width={styles.user.width}
      resizeMode="stretch"
      borderRadius={styles.user.borderRadius}
    />
  );
}
