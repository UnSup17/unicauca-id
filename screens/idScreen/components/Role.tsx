import { useContext, useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { UserContext } from "../../../context/UserContext";

interface IRole {
  imgW: number;
}

export default function Role({ imgW }: IRole) {
  const {
    userData: { currentUser },
  } = useContext(UserContext);

  const roles = currentUser.roles
    .replace("[", "")
    .replace("]", "")
    .replace(" ", "")
    .split(",")
    .reverse();

  const numberRoles = roles.length;

  const [actualRol, setactualRol] = useState(0);

  const handleNextRole = () => {
    setactualRol((prev) => (prev + 1) % numberRoles);
  };

  return (
    <Pressable
      onPress={handleNextRole}
      style={[
        styles.labelWrapper,
        {
          transform: [{ rotate: "-90deg" }, { translateY: imgW * 0.7 }],
        },
      ]}
    >
      <Text style={styles.label}>{roles[actualRol]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  labelWrapper: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#AB1919",
  },
});
