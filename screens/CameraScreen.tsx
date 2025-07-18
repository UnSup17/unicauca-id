"use client";

import { CameraView, useCameraPermissions } from "expo-camera";
import type React from "react";
import { useContext, useEffect, useRef } from "react";
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
import { Colors } from "../constants/Colors";
import { tryPostProfilePhoto } from "../services/cameraScreen";
import { UserContext } from "../context/UserContext";
import { LoadingContext } from "../context/LoadingContext";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const CameraScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { setLoading } = useContext(LoadingContext);
  const [permission, requestPermission] = useCameraPermissions();
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
      // Retorna true para bloquear
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Limpia el listener al desmontar
    return () => backHandler.remove();
  }, []);

  if (!permission) {
    return <View />;
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
    setLoading(true);
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });

        const res = await tryPostProfilePhoto({
          photo,
          data,
          token,
          setUserData,
        });
        setLoading(false);
        if (res) navigation.navigate("ID");
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", error + "");
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={"front"}
          ref={cameraRef}
          ratio="1:1"
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
  //permissions
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
    // height: "100%"
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
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
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
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
});
