"use client";

import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  ImageResult,
  manipulateAsync,
  SaveFormat,
} from "expo-image-manipulator";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AcceptPhoto from "./components/AcceptPhoto";
import { styles } from "./styles";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const CameraScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);
  const cameraRef = useRef<CameraView>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture>();
  const [cropped, setCropped] = useState<ImageResult>();

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
    try {
      const photoAux = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      setPhoto(photoAux);
      const { width, height } = photoAux;
      const side = Math.min(width, height);
      const originX = (width - side) / 2;
      const originY = (height - side) / 2;

      const croppedAux = await manipulateAsync(
        photoAux.uri,
        [{ crop: { originX, originY, width: side, height: side } }],
        {
          base64: true,
          compress: 1,
          format: SaveFormat.JPEG,
        }
      );
      setCropped(croppedAux);
      setPhotoPreview(croppedAux.uri); // Mostrar modal con la foto
    } catch (error: any) {
      Alert.alert("Error", error.message);
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

      {photoPreview && photo && cropped && (
        <AcceptPhoto
          {...{ cropped, navigation, photo, photoPreview, setPhotoPreview }}
        />
      )}
    </SafeAreaView>
  );
};
