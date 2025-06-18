import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { Colors } from "../constants/Colors";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const WelcomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { height } = useWindowDimensions();

  const handleTakePhoto = () => {
    navigation.navigate("Camera");
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          display: "flex",
          flexDirection: "column",
          paddingHorizontal: "10%",
        }}
      >
        {/* Content */}
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido</Text>
          <View style={styles.titleLine} />

          {/* Description */}
          <Text style={styles.description}>
            Este es el aplicativo oficial de la Universidad del Cauca para la
            creación del carné digital, una herramienta práctica y sostenible
            que te identifica como miembro activo de nuestra comunidad
            universitaria.
          </Text>

          <Text style={styles.subtitle}>
            ¡Tu identidad universitaria más cerca que nunca!
          </Text>

          {/* Camera Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Tomar una foto"
              onPress={handleTakePhoto}
              size={height < 800 ? "small" : "normal"}
              style={styles.cameraButton}
            >
              <Ionicons name="camera-outline" size={48} color={Colors.white} />
            </CustomButton>
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/unicauca_logo_label_azul.png")}
              style={{ width: 218, height: 91 }}
              contentFit="contain"
            />
          </View>

          <View style={styles.separator} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerDivision}>2024 | Carné Digital |</Text>
          <Text style={styles.footerDivision}>
            Vicerrectoría Administrativa
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={styles.footerDivision}>
            División de Tecnologías de la Información y las Comunicaciones
          </Text>
          <Text style={styles.footerDivision}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: "20%",
    color: Colors.primary,
  },
  titleLine: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 5,
    width: "27%",
    marginBottom: "10%",
  },
  description: {
    fontSize: 18,
    color: Colors.gray,
    lineHeight: 24,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "500",
    marginBottom: 60,
  },
  buttonContainer: {
    alignItems: "center",
  },
  cameraButton: {
    width: 200,
    height: 100,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "100%",
    alignSelf: "center",
  },
  footer: {
    paddingVertical: "18%",
    alignItems: "center",
  },
  footerDivision: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 50,
  },
});
