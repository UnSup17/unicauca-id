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
import PersonPhoto from "./components/PersonPhoto";
import { QRCodeView } from "./components/QRCode";
import TopLeftSVG from "./components/TopLeft";
import { large, medium, small } from "./styles";
import { getColorsForRole, parseRoles } from "../../util/roleUtils";

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

  const { userData } = useContext(UserContext);
  const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Salir", "¿Cerrar sesión?", [
        { text: "No", style: "cancel", onPress: () => null },
        {
          text: "Sí",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]);
      return true;
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
    navigation.navigate("Login");
    return <></>;
  }

  const roles = parseRoles(userData.currentUser.roles);
  const currentRole = roles[currentRoleIndex] || "";
  const { nameColor, surnameColor, tableTextColor } = getColorsForRole(currentRole);

  const handleRoleChange = () => {
    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.upper}>
          <TopLeftSVG roles={roles} currentRoleIndex={currentRoleIndex} />
        </View>
        <View style={{ top: styles.user.top, width: styles.card.width, zIndex: 10 }}>
          <PersonPhoto
            styles={styles}
            currentRoleIndex={currentRoleIndex}
            onRoleChange={handleRoleChange}
            roles={roles}
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: nameColor }]}>{userData.currentUser.name}</Text>
          <Text style={[styles.lastname, { color: surnameColor }]}>{userData.currentUser.surname}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                style={{
                  color: tableTextColor,
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
                {userData.currentUser?.idType} {userData.currentUser?.idNumber}
              </Text>
              <Text style={{ width: styles.rhCol.width, ...styles.tableDesc }}>
                {userData.currentUser?.blood}
              </Text>
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
