import { useContext, useEffect, useState } from "react";
import { Alert, DimensionValue, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { UserContext } from "../../context/UserContext";

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
  const {
    userData: { token },
    setUserData,
  } = useContext(UserContext);

  useEffect(() => {
    const fetchData = () => {
      fetch(
        `https://backend.unicauca.edu.co/unid/armatura/${identification}/qr`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            Alert.alert(
              "Sesión expirada",
              "Por favor inicia sesión nuevamente"
            );
            setUserData(null);
            navigation.navigate("Login");
          }
          return res;
        })
        .then((res) => res.json())
        .then((json) => setInfo(json))
        .catch((err) => setInfo(err.message));
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  if (!info) return <></>;
  return (
    <View style={{ paddingTop: paddingTop }}>
      <QRCode value={info.data} size={size} backgroundColor="white" />
    </View>
  );
}
