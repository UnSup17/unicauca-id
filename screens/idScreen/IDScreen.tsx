import React, { useContext } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Bottom from "../../assets/svgs/bottom_right.svg";
import { UserContext } from "../../context/UserContext";
import BloodType from "./BloodType";
import PP from "./PP";
import { QRCodeView } from "./QRCode";
import TopLeftSVG from "./TopLeft";
import { large, medium, small } from "./styles";

export const IDScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const styles =
    width > 440 && height > 870
      ? large
      : width > 370 && height > 700
      ? medium
      : small;

  const {
    userData: { currentUser, token },
  } = useContext(UserContext);

  if (styles === null) {
    return <></>;
  }
  if (!currentUser) {
    return <Text>:(</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.upper}>
          <TopLeftSVG />
        </View>
        <PP styles={styles}></PP>
        <View style={styles.info}>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.lastname}>{currentUser.surname}</Text>
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
                {currentUser.idNumber}
              </Text>
              <BloodType
                style={{ width: styles.rhCol.width, ...styles.tableDesc }}
              />
            </View>
          </View>
          <QRCodeView
            identification={currentUser.idNumber}
            paddingTop={styles.qrCodeView.paddingTop}
            size={styles.qrCodeView.size}
          />
        </View>
        <View style={styles.bottom}>
          <Bottom width={"100%"} height={"100%"} />
        </View>
      </View>
    </SafeAreaView>
  );
};
