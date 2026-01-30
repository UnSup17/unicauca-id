import { useContext, useEffect, useState } from "react";
import { Alert, DimensionValue, View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { UserContext } from "../../../context/UserContext";
import { apiFetch, IS_LOCAL } from "../../../util/api";

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

  useEffect(() => {
    const fetchData = () => {
      apiFetch(`/armatura/${identification}/qr`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            Alert.alert(
              "Sesión expirada",
              "Por favor inicia sesión nuevamente",
            );
            navigation.navigate("Login");
          }
          return res;
        })
        .then((res) => res.text())
        .then((text) => setInfo(text))
        .catch((err) => setInfo("" + err));
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  if (!info) return <></>;
  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info} size={size} backgroundColor="white" />

      {/* Debug: Show API response only in local development */}
      {IS_LOCAL && (
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
