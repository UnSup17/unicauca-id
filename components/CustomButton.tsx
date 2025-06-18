import type React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  size: "normal" | "small";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  size,
  style,
  textStyle,
  disabled = false,
  children,
}) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors.secondary,
      borderRadius: 10,
      paddingVertical: size === "normal" ? 16 : 12,
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: Colors.white,
      fontSize: size === "normal" ? 16 : 12,
      fontWeight: "600",
    },
    disabled: {
      opacity: 0.6,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
