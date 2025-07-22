import type React from "react";
import { useContext } from "react";
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { Colors } from "../constants/Colors";
import { LoadingContext } from "../context/LoadingContext";

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
  const { loading } = useContext(LoadingContext);
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
      disabled={loading || disabled}
    >
      {children}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
