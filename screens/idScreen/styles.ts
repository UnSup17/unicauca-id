import { DimensionValue, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Colors } from "../../constants/Colors";

export type IDScreenStyles = {
  container: ViewStyle;
  card: ViewStyle;
  upper: ViewStyle;
  user: ViewStyle & {
    height: number;
    width: number;
    borderRadius: number;
    top: number;
  };
  info: ViewStyle;
  name: TextStyle;
  lastname: TextStyle;
  table: ViewStyle;
  tableHeader: ViewStyle;
  tableRow: ViewStyle;
  idCol: { width: DimensionValue };
  rhCol: { width: DimensionValue };
  tableLabel: TextStyle;
  tableDesc: TextStyle;
  qrCodeView: {
    paddingTop: DimensionValue;
    size: number;
  }
  bottom: ViewStyle & {
    position: "absolute";
    bottom: number;
    right: number;
    width: number;
    height: number;
  };
};

const small: IDScreenStyles = StyleSheet.create<IDScreenStyles>({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.white,
    position: "relative",
    width: 280,
    height: 500,
    alignItems: "center",
  },
  upper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 249.74,
    height: 261,
    zIndex: 1,
  },
  user: {
    width: 162,
    height: 150,
    top: 88,
    borderRadius: 20,
  },
  info: {
    top: 110,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  name: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 20
  },
  lastname: {
    fontFamily: "Sans-serif",
    color: "#AB1919",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 14,
  },
  table: {
    width: 160,
    marginTop: 18,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  idCol: {
    width: "70%"
  },
  rhCol: {
    width: "30%"
  },
  tableLabel: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 12,
    paddingVertical: 0,
    textAlign: "center",
  },
  tableDesc: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontSize: 10,
    paddingBottom: 4,
    textAlign: "center",
  },
  qrCodeView: {
    paddingTop: 20,
    size: 100,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 68,
    height: 175,
  },
});

const medium: IDScreenStyles = StyleSheet.create<IDScreenStyles>({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.white,
    position: "relative",
    width: 357,
    height: 645,
    alignItems: "center",
  },
  upper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 319,
    height: 334,
    zIndex: 1,
  },
  user: {
    width: 205,
    height: 192,
    top: 113,
    borderRadius: 26,
  },
  info: {
    top: 145,
    width: "100%",
    alignItems: "center",
  },
  name: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 27
  },
  lastname: {
    fontFamily: "Sans-serif",
    color: "#AB1919",
    fontWeight: "bold",
    fontSize: 22,
    lineHeight: 20,
  },
  table: {
    width: 200,
    marginTop: 18,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  idCol: {
    width: "70%"
  },
  rhCol: {
    width: "30%"
  },
  tableLabel: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 15,
    paddingVertical: 0,
    textAlign: "center",
  },
  tableDesc: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontSize: 13,
    paddingBottom: 4,
    textAlign: "center",
  },  
  qrCodeView: {
    paddingTop: 20,
    size: 150,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 86,
    height: 224,
  },
});

const large: IDScreenStyles = StyleSheet.create<IDScreenStyles>({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.white,
    position: "relative",
    width: 430,
    height: 850,
    alignItems: "center",
  },
  upper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 384.5,
    height: 402,
    zIndex: 1,
  },
  user: {
    width: 250,
    height: 230,
    borderRadius: 20,
    top: 136,
  },
  info: {
    top: 170,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  name: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 33
  },
  lastname: {
    fontFamily: "Sans-serif",
    color: "#AB1919",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 26,
  },
  table: {
    width: 250,
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  idCol: {
    width: "60%"
  },
  rhCol: {
    width: "40%"
  },
  tableLabel: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 4,
    textAlign: "center",
  },
  tableDesc: {
    fontFamily: "Sans-serif",
    color: "#27316C",
    fontSize: 18,
    paddingVertical: 4,
    textAlign: "center",
  },
  qrCodeView: {
    paddingTop: 40,
    size: 200,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 120,
    height: 300,
  },
});

export { large, medium, small };
