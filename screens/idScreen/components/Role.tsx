import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { UserContext } from "../../../context/UserContext";

interface IRole {
  imgW: number;
}

export default function Role({ imgW }: IRole) {
  const { userData } = useContext(UserContext);

  const roles =
    userData?.currentUser?.roles
      .replace("[", "")
      .replace("]", "")
      .replace(" ", "")
      .split(",")
      .reverse() || [];

  const [actualRol, setactualRol] = useState(0);

  const handleNextRole = () => {
    setactualRol((prev) => (prev + 1) % roles.length);
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
