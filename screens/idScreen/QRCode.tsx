import { useEffect, useState } from "react";
import { DimensionValue, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface IQRCodeView {
  identification: string;
  paddingTop: DimensionValue;
  size: number;
}
export function QRCodeView({ identification, paddingTop, size }: IQRCodeView) {
  const [info, setInfo] = useState<any>();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://192.168.52.65:8080/api/v1/armatura/${identification}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((json) => setInfo(json))
        .catch((err) => setInfo(err.message));
    }, 10000000);

    return () => clearInterval(interval);
  }, []);
  if (!info) return <Text>Cargando</Text>;
  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info.data} size={size} backgroundColor="white" />
    </View>
  );
}
