import { useContext } from "react";
import { Image } from "react-native";
import { UserContext } from "../../context/UserContext";

interface IPP {
  styles: {
    user: {
      top: number;
      height: number;
      width: number;
      borderRadius: number;
    };
  };
}
export default function PP({ styles }: IPP) {
  const {
    userData: { currentUser },
  } = useContext(UserContext);
  return (
    <Image
      source={{ uri: currentUser.pp }}
      style={{ top: styles.user.top }}
      height={styles.user.height}
      width={styles.user.width}
      resizeMode="stretch"
      borderRadius={styles.user.borderRadius}
    />
  );
}
