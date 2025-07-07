import React, { useContext, useEffect } from "react";
import {
  Alert,
  BackHandler,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Bottom from "../../assets/svgs/bottom_right.svg";
import { UserContext } from "../../context/UserContext";
import BloodType from "./BloodType";
import PersonPhoto from "./PersonPhoto";
import { QRCodeView } from "./QRCode";
import TopLeftSVG from "./TopLeft";
import { large, medium, small } from "./styles";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const IDScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const styles =
    width > 440 && height > 870
      ? large
      : width > 370 && height > 700
      ? medium
      : small;

  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Salir", "¿Cerrar sesión?", [
        { text: "No", style: "cancel", onPress: () => null },
        {
          text: "Sí",
          onPress: () => {
            setUserData(null);
            navigation.navigate("Login");
          },
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

  if (styles === null) {
    return <></>;
  }

  if (!userData || !userData?.currentUser) {
    return <Text>:(</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.upper}>
          <TopLeftSVG />
        </View>
        <PersonPhoto styles={styles}></PersonPhoto>
        <View style={styles.info}>
          <Text style={styles.name}>{userData.currentUser.name}</Text>
          <Text style={styles.lastname}>{userData.currentUser.surname}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                style={{
                  width: styles.idCol.width,
                  borderRightWidth: 1,
                  ...styles.tableLabel,
                }}
              >
                Identificación
              </Text>
              <Text style={{ width: styles.rhCol.width, ...styles.tableLabel }}>
                RH
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text
                style={{
                  width: styles.idCol.width,
                  borderRightWidth: 1,
                  ...styles.tableDesc,
                }}
              >
                {userData.currentUser.idNumber}
              </Text>
              <BloodType
                style={{ width: styles.rhCol.width, ...styles.tableDesc }}
              />
            </View>
          </View>
          <QRCodeView
            identification={userData.currentUser.idNumber}
            paddingTop={styles.qrCodeView.paddingTop}
            size={styles.qrCodeView.size}
            navigation={navigation}
          />
        </View>
        <View style={styles.bottom}>
          <Bottom width={"100%"} height={"100%"} />
        </View>
      </View>
    </SafeAreaView>
  );
};
