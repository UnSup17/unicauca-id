import { useContext, useEffect, useState } from "react";
import { Alert, DimensionValue, View, Text, Image } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { UserContext } from "../../../context/UserContext";
import { apiFetch, getCurrentEnv } from "../../../util/api";

interface IQRCodeView {
  identification: string;
  paddingTop: DimensionValue;
  size: number;
  navigation: any;
}
export function QRCodeView({
  identification,
  paddingTop,
  size,
  navigation,
}: IQRCodeView) {
  const [info, setInfo] = useState<any>();
  const { userData } = useContext(UserContext);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setHasError(false);
      apiFetch(`/armatura/${identification}/qr`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            // If session expired, redirect
            if (res.status === 401 || res.status === 403) {
              Alert.alert(
                "Sesión expirada",
                "Por favor inicia sesión nuevamente",
              );
              navigation.navigate("Login");
              return null;
            }
            // Other errors -> maintenance
            throw new Error("Server error");
          }
          return res.text();
        })
        .then((text) => {
          if (text) setInfo(text);
        })
        .catch((err) => {
          console.error("QR Fetch Error:", err);
          setHasError(true);
          setInfo(null);
        });
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (hasError) {
    return (
      <View style={{ paddingTop: paddingTop, alignItems: "center" }}>
        {/* Maintenance Image - User provided */}
        <Image
          source={require("../../../assets/images/maintenance.jpg")}
          style={{ width: size, height: size, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            color: "red",
            fontSize: 12,
            maxWidth: size,
          }}
        >
          El servidor se encuentra en mantenimiento. Si la situación continua
          por favor envía un correo a contacto@unicauca.edu.co
        </Text>
      </View>
    );
  }

  if (!info) return <View style={{ width: size, height: size }} />; // Placeholder/Loading

  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info} size={size} backgroundColor="white" />

      {/* Debug: Show API response only in local development or test */}
      {getCurrentEnv() !== "PROD" && (
        <View
          style={{
            marginTop: 8,
            padding: 8,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
            maxWidth: size,
          }}
        >
          <Text style={{ fontSize: 10, color: "#666", fontWeight: "bold" }}>
            API Response:
          </Text>
          <Text
            style={{ fontSize: 9, color: "#333", fontFamily: "monospace" }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {JSON.stringify(info, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}
