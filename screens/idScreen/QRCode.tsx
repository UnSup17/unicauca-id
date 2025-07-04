import Constants from "expo-constants";
import { useContext, useEffect, useState } from "react";
import { DimensionValue, View } from "react-native";
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
    const fetchData = async () => {
      fetch(
        `${
          Constants.expoConfig?.extra?.apiUrl ||
          "https://backend.unicauca.edu.co/unid"
        }/armatura/${identification}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => setInfo(json))
        .catch((err) => setInfo(err.message));
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  if (!info) return <></>;
  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info.data} size={size} backgroundColor="white" />
    </View>
  );
}
