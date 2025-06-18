import type React from "react"
import { TextInput, StyleSheet, type TextInputProps } from "react-native"
import { Colors } from "../constants/Colors"

interface CustomInputProps extends TextInputProps {
  placeholder: string
  size: "normal" | "small"
}

export const CustomInput: React.FC<CustomInputProps> = ({ placeholder, size, ...props }) => {
  const styles = StyleSheet.create({
    input: {
      backgroundColor: Colors.white,
      borderRadius: 8,
      paddingHorizontal: size === "normal" ? 16: 12,
      paddingVertical: size === "normal" ? 16: 12,
      fontSize: size === "normal" ? 16: 12,
      color: Colors.text,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
  })

  return (
    <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={Colors.placeholder} {...props} />
  )
}

