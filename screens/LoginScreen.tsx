"use client";

import { Image } from "expo-image";
import { jwtDecode } from "jwt-decode";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { Colors } from "../constants/Colors";
import { LoadingContext } from "../context/LoadingContext";
import { UserContext } from "../context/UserContext";
import { fetchIdScreenData } from "../services/idScreen";
import { login } from "../services/login";
import { checkObservation } from "../services/observations";
import { encodePassword } from "../util/cryp";

interface NavigationProps {
  navigation: any;
}

export const LoginScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [styles, setStyles] = useState<any>(normalSizes);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);

  const { height } = useWindowDimensions();

  useEffect(() => {
    setUserData(null);
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Salir", "¿Quieres cerrar la aplicación?", [
        { text: "No", style: "cancel", onPress: () => null },
        {
          text: "Sí",
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true; // Bloquea la acción por defecto
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (height < 800) {
      setStyles(smallSizes);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Por favor completa todos los campos");
      }

      const res = await login(username, encodePassword(password) || "");
      if (!res) {
        throw new Error("Credenciales incorrectas");
      }

      const currentUser = jwtDecode(res);
      const token = JSON.parse(res).token;

      if (!currentUser) {
        throw new Error(
          "No fue posible obtener información del usuario, dirígase a contact55"
        );
      }

      setUserData({ currentUser, token });

      // Check for observations
      const observation = await checkObservation((currentUser as any).idNumber);
      
      if (observation && observation.id) {
        navigation.navigate("Observation", { observation });
      } else {
        await fetchIdScreenData({
          idNumber: (currentUser as any).idNumber,
          token,
          setUserData,
          navigation,
        });
      }
    } catch (error: any) {
      Alert.alert("Login error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.mainView}>
            <View style={styles.header}>
              <Image
                source={require("../assets/logoLogin.png")}
                style={{
                  width: styles.imageHeader.width,
                  height: styles.imageHeader.height,
                }}
                contentFit="contain"
              />
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Usuario Institucional <Text style={styles.required}>*</Text>
                </Text>
                <CustomInput
                  placeholder="Usuario institucional"
                  size={height < 800 ? "small" : "normal"}
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Contraseña <Text style={styles.required}>*</Text>
                </Text>
                <CustomInput
                  placeholder="Contraseña"
                  size={height < 800 ? "small" : "normal"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <CustomButton
                title="Iniciar sesión"
                onPress={handleLogin}
                size={height < 800 ? "small" : "normal"}
                style={styles.loginButton}
              />
            </View>

            <View style={styles.colorStripe}>
              <View style={styles.stripe1} />
              <View style={styles.stripe2} />
              <View style={styles.stripe3} />
              <View style={styles.stripe4} />
              <View style={styles.stripe5} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const smallSizes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get("screen").height,
  },
  header: {
    alignItems: "center",
    paddingTop: "20%",
    paddingBottom: 20,
  },
  imageHeader: {
    width: 150,
    height: 150,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.white,
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "#ef4444",
  },
  loginButton: {
    marginTop: 16,
  },
  colorStripe: {
    height: 8,
    flexDirection: "row",
  },
  stripe1: {
    height: 8,
    backgroundColor: "#DB141C",
    width: "20%",
  },
  stripe2: {
    height: 8,
    backgroundColor: "#FC6C08",
    marginBottom: 20,
    width: "20%",
  },
  stripe3: {
    height: 8,
    backgroundColor: "#FBD000",
    marginBottom: 20,
    width: "20%",
  },
  stripe4: {
    height: 8,
    backgroundColor: "#20AAE5",
    marginBottom: 20,
    width: "20%",
  },
  stripe5: {
    height: 8,
    backgroundColor: "#5A0DBA",
    marginBottom: 20,
    width: "20%",
  },
});

const normalSizes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get("screen").height,
  },
  header: {
    alignItems: "center",
    paddingTop: "30%",
    paddingBottom: 60,
  },
  imageHeader: {
    width: 200,
    height: 200,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "#ef4444",
  },
  loginButton: {
    marginTop: 16,
  },
  colorStripe: {
    height: 8,
    flexDirection: "row",
  },
  stripe1: {
    height: 8,
    backgroundColor: "#DB141C",
    width: "20%",
  },
  stripe2: {
    height: 8,
    backgroundColor: "#FC6C08",
    marginBottom: 20,
    width: "20%",
  },
  stripe3: {
    height: 8,
    backgroundColor: "#FBD000",
    marginBottom: 20,
    width: "20%",
  },
  stripe4: {
    height: 8,
    backgroundColor: "#20AAE5",
    marginBottom: 20,
    width: "20%",
  },
  stripe5: {
    height: 8,
    backgroundColor: "#5A0DBA",
    marginBottom: 20,
    width: "20%",
  },
});
