"use client";

import { Image } from "expo-image";
import { jwtDecode } from "jwt-decode";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
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
import { login } from "../services/login";
import { encodePassword } from "../util/cryp";
import { fetchIdScreenData } from "../services/idScreen";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const LoginScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [styles, setStyles] = useState<any>(normalSizes);

  const [email, setEmail] = useState("andrescd");
  const [password, setPassword] = useState("123456789");

  const { setUserData } = useContext(UserContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const { height } = useWindowDimensions();

  useEffect(() => {
    if (height < 800) {
      setStyles(smallSizes);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const res = await login(email, encodePassword(password) || "");
    // setAux(res);
    if (!res) {
      Alert.alert("Error", "Credenciales incorrectas");
      setLoading(false);
      return;
    }

    const currentUser = jwtDecode(res); // Validate JWT structure
    const token = JSON.parse(res).token; // Extract token from the response

    setUserData({ currentUser, token });

    await fetchIdScreenData({
      idNumber: (currentUser as any).idNumber,
      token,
      setUserData,
      navigation,
    });
    setLoading(false);
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
                source={require("../assets/images/card_login.png")}
                style={{
                  width: styles.imageHeader.width,
                  height: styles.imageHeader.height,
                }}
                contentFit="contain"
              />
              <Text style={styles.title}>UniCauca ID</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Correo Institucional <Text style={styles.required}>*</Text>
                </Text>
                <CustomInput
                  placeholder="Correo institucional"
                  size={height < 800 ? "small" : "normal"}
                  value={email}
                  onChangeText={setEmail}
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
                disabled={loading}
                size={height < 800 ? "small" : "normal"}
                style={styles.loginButton}
              />

              <View style={styles.separator}>
                <Text style={styles.label} />
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/unicauca_logo_label_blanco.png")}
                  style={{ width: 218, height: 91 }}
                  contentFit="contain"
                />
              </View>
            </View>

            <View style={styles.colorStripe}>
              <View style={styles.stripe1} />
              <View style={styles.stripe2} />
              <View style={styles.stripe3} />
              <View style={styles.stripe4} />
              <View style={styles.stripe5} />
            </View>
          </View>

          {/* Footer */}
          <View
            style={{
              display:
                Dimensions.get("screen").height < 800 ? "none" : "contents",
            }}
          >
            <View style={styles.footerInfo}>
              <Text style={styles.footerTitle}>Universidad del Cauca</Text>
              <Text style={styles.footerSubtitle}>NIT. 891500319-2</Text>

              <Text style={styles.footerText}>Carné Digital</Text>
              <Text style={styles.footerText}>
                División de Tecnologías de la Información
              </Text>
              <Text style={styles.footerText}>y las Comunicaciones - TIC</Text>

              <View style={styles.separator2} />

              <Text style={styles.footerText}>
                Vicerrectoría Administrativa
              </Text>
              <Text style={styles.footerText}>Versión 1.0.0</Text>

              <View style={styles.separator2} />

              <Text style={styles.footerText}>
                Sistema de Atención y Soporte - SATIS
              </Text>
              <Text style={styles.footerText}>2024</Text>

              <View style={styles.separator2} />

              <Text style={styles.footerText}>
                Institución con Acreditación de Alta
              </Text>
              <Text style={styles.footerText}>
                Calidad por 8 años Resolución MEN 6218
              </Text>
              <Text style={styles.footerText}>
                de 2019 - Vigilada MinEducación
              </Text>

              <View style={styles.separator2} />

              <Text style={styles.footerText}>
                Política de Protección de Datos Personales |
              </Text>
              <Text style={styles.footerText}>
                Política de Seguridad de la Información
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const smallSizes = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },
  mainView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  imageHeader: {
    width: 70,
    height: 130,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
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
  logoContainer: {
    alignItems: "center",
    marginVertical: 36,
  },
  universityName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
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
  separator: {
    height: 1,
    backgroundColor: Colors.white,
    marginTop: 40,
  },
  separator2: {
    height: 1,
    backgroundColor: Colors.gray,
    marginTop: 16,
    marginBottom: 16,
    width: "65%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },
  mainView: {
    height: Dimensions.get("screen").height,
  },
  header: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 60,
  },
  imageHeader: {
    width: 100,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
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
  logoContainer: {
    alignItems: "center",
    marginVertical: 36,
  },
  universityName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
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
  footerInfo: {
    backgroundColor: Colors.lightGray,
    paddingTop: 16,
    paddingBottom: 32,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray,
    textAlign: "center",
    marginTop: 8,
  },
  footerSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 28,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 16,
  },
});
