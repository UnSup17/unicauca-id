import { CameraCapturedPicture } from "expo-camera";
import { ImageResult } from "expo-image-manipulator";
import type React from "react";
import { useContext } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { LoadingContext } from "../../../context/LoadingContext";
import { UserContext } from "../../../context/UserContext";
import { tryPostProfilePhoto } from "../../../services/cameraScreen";
import { deleteObservation } from "../../../services/observations";
import { styles } from "../styles";

interface IAcceptPhoto {
  photoPreview: string;
  photo: CameraCapturedPicture;
  cropped: ImageResult;
  navigation: any;
  setPhotoPreview: (value: React.SetStateAction<string | null>) => void;
  observationId?: string;
}
export default function AcceptPhoto({
  photoPreview,
  photo,
  cropped,
  navigation,
  setPhotoPreview,
  observationId,
}: IAcceptPhoto) {
  const { setLoading } = useContext(LoadingContext);
  const { userData, setUserData } = useContext(UserContext);

  const confirmPhoto = async () => {
    setLoading(true);
    try {
      const res = await tryPostProfilePhoto({
        photo: cropped,
        type: photo.format,
        data: userData?.currentUser?.data,
        token: userData?.token,
        setUserData,
      });

      if (res) {
        if (observationId) {
          await deleteObservation(observationId);
        }
        navigation.navigate("ID");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setPhotoPreview(null);
    }
  };

  const retakePhoto = () => {
    setPhotoPreview(null);
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
          ¿Deseas usar esta foto?
        </Text>
        <View
          style={{
            width: Dimensions.get("screen").width * 0.8,
            height: Dimensions.get("screen").width * 0.8,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <Image
            source={{ uri: photoPreview }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.secondary }]}
            onPress={confirmPhoto}
          >
            <Text style={styles.buttonText}>Usar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.gray }]}
            onPress={retakePhoto}
          >
            <Text style={styles.buttonText}>Repetir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
