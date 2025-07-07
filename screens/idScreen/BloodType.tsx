import { useContext } from "react";
import { Text } from "react-native";
import { UserContext } from "../../context/UserContext";

interface Props {
  style: any;
}

export default function BloodType({ style }: Props) {
  const {
    userData: { currentUser },
  } = useContext(UserContext);
  return <Text style={style}>{currentUser.blood}</Text>;
}
