import { useContext, useEffect, useState } from "react";
import { DimensionValue, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { UserContext } from "../../context/UserContext";

interface IQRCodeView {
  identification: string;
  paddingTop: DimensionValue;
  size: number;
}
export function QRCodeView({ identification, paddingTop, size }: IQRCodeView) {
  const [info, setInfo] = useState<any>();
  const {
    userData: { token },
  } = useContext(UserContext);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/armatura/${identification}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => setInfo(json))
        .catch((err) => setInfo(err.message));
    }, 100000000000000);

    return () => clearInterval(interval);
  }, []);
  if (!info) return <Text>Cargando</Text>;
  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info.data} size={size} backgroundColor="white" />
    </View>
  );
}
