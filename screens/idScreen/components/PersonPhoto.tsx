import React, { useContext } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { UserContext } from "../../../context/UserContext";
import Role from "./Role";

export interface IPersonPhoto {
  styles: {
    user: {
      top: number;
      height: number;
      width: number;
      borderRadius: number;
    };
  };
}

export default function PersonPhoto({ styles: { user } }: IPersonPhoto) {
  const { userData } = useContext(UserContext);

  if (!userData || !userData.currentUser?.data) {
    return <></>;
  }

  const personPhoto = userData.currentUser.data.personPhoto;

  return (
    <View style={stylesWrapper.container}>
      <Image
        source={{ uri: "data:image/jpeg;base64," + personPhoto }}
        style={{
          height: user.height,
          width: user.width,
          borderRadius: user.borderRadius,
          resizeMode: "stretch",
        }}
      />
      <Role imgW={user.width} />
    </View>
  );
}

const stylesWrapper = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
