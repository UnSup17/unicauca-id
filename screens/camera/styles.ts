import {
  Dimensions,
  StyleSheet
} from "react-native";
import { Colors } from "../../constants/Colors";


export const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
  // camera
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: Colors.secondary,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
  },
  camera: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  faceGuide: {
    width: Dimensions.get("screen").width / 2,
    height: (Dimensions.get("screen").width / 5) * 4,
    borderRadius: 65,
    borderBottomLeftRadius: 125,
    borderBottomRightRadius: 125,
    borderWidth: 4,
    marginHorizontal: Dimensions.get("screen").width / 4,
    borderColor: Colors.lightGray,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  // controls
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
    backgroundColor: Colors.primary,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
