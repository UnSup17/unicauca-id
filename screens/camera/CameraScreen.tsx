"use client";

import { CameraView, useCameraPermissions } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import type React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { LoadingContext } from "../../context/LoadingContext";
import { UserContext } from "../../context/UserContext";
import { tryPostProfilePhoto } from "../../services/cameraScreen";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const CameraScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { setLoading } = useContext(LoadingContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);
  const cameraRef = useRef<CameraView>(null);

  const {
    userData: {
      currentUser: { data },
      token,
    },
    setUserData,
  } = useContext(UserContext);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  if (!permission) {
    return (
      <Text style={styles.message}>
        Necesitamos permisos para usar la cámara
      </Text>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Necesitamos permisos para usar la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) {
      throw new Error("Error al acceder a la cámara");
    }
    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      const { width, height } = photo;
      const side = Math.min(width, height);
      const originX = (width - side) / 2;
      const originY = (height - side) / 2;

      const cropped = await manipulateAsync(
        photo.uri,
        [{ crop: { originX, originY, width: side, height: side } }],
        {
          base64: true,
          compress: 1,
          format: SaveFormat.JPEG,
        }
      );

      const res = await tryPostProfilePhoto({
        photo: { ...photo, base64: cropped.base64 },
        data,
        token,
        setUserData,
      });

      if (res) navigation.navigate("ID");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareCamera = async () => {
    try {
      if (cameraRef.current) {
        const supportedRatios =
          await cameraRef.current.getAvailablePictureSizesAsync();
        setPictureSize(supportedRatios[0]);
      }
    } catch (error: any) {
      Alert.alert("prepareCameraError", error.message as string);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={"front"}
          ref={cameraRef}
          pictureSize={pictureSize}
          onCameraReady={prepareCamera}
        />
        <View style={styles.overlay}>
          <View style={styles.faceGuide} />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
