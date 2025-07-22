import * as ScreenCapture from "expo-screen-capture";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppNavigator } from "./navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    const blockScreenshots = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    blockScreenshots();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);
  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
