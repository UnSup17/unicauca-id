import { Pressable, StyleSheet, Text } from "react-native";
import { getColorsForRole } from "../../../util/roleUtils";

export default function Role({ imgW, currentRoleIndex, onRoleChange, roles }: { imgW: number, currentRoleIndex: number, onRoleChange: () => void, roles: string[] }) {

  const { roleColor } = getColorsForRole(roles[currentRoleIndex]);
  return (
    <Pressable
      onPress={onRoleChange}
      style={[
        styles.labelWrapper,
        {
          transform: [{ rotate: "-90deg" }, { translateY: imgW * 0.7 }],
        },
      ]}
    >
      <Text style={[styles.label, { color: roleColor }]}>{roles[currentRoleIndex]}</Text>
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
  },
});
