import React, { useEffect, useState } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Bottom from "../../assets/svgs/bottom_right.svg";
import TopLeftSVG from "./TopLeft";
import { IDScreenStyles, large, medium, small } from "./styles";
import { QRCodeView } from "./QRCode";

interface NavigationProps {
  navigation: any;
  route?: any;
}

export const IDScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [styles, setStyles] = useState<IDScreenStyles | null>(null);
  const { width, height } = useWindowDimensions();
  const [info, setInfo] = useState<any>();

  useEffect(() => {
    fetch(`http://192.168.52.65:8080/api/v1/person/12998174`)
      .then((res) => res.json())
      .then((json) => setInfo(json))
      .catch((err) => setInfo(err.message));
  }, []);

  useEffect(() => {
    if (width > 440 && height > 870) {
      setStyles(large);
    } else if (width > 370 && height > 700) {
      setStyles(medium);
    } else {
      setStyles(small);
    }
  }, []);

  if (styles === null) {
    return <></>;
  }
  if (!info) {
    return <Text>Cargando</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.upper}>
          <TopLeftSVG />
        </View>
        <Image
          source={require("../../assets/images/user.jpg")}
          style={{ top: styles.user.top }}
          height={styles.user.height}
          width={styles.user.width}
          resizeMode="stretch"
          borderRadius={styles.user.borderRadius}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{info.name}</Text>
          <Text style={styles.lastname}>{info.lastName}</Text>
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
                {info.typeIdentification}. {info.identification}
              </Text>
              <Text style={{ width: styles.rhCol.width, ...styles.tableDesc }}>
                {info.rh}
              </Text>
            </View>
          </View>
          <QRCodeView identification={info.identification} paddingTop={styles.qrCodeView.paddingTop} size={styles.qrCodeView.size}/>
        </View>
        <View style={styles.bottom}>
          <Bottom width={"100%"} height={"100%"} />
        </View>
      </View>
    </SafeAreaView>
  );
};
