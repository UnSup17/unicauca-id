import * as ScreenCapture from "expo-screen-capture";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { AppNavigator } from "./navigation/AppNavigator";
import { UpdateScreen } from "./screens/UpdateScreen";
import { apiFetch, NetworkError } from "./util/api";
import { NetworkErrorDisplay } from "./components/NetworkErrorDisplay";

export default function App() {
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [remoteVersion, setRemoteVersion] = useState<string | undefined>(
    undefined,
  );
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);

  const checkAppVersion = useCallback(async () => {
    setIsChecking(true);
    setNetworkError(null);
    try {
      const response = await apiFetch("/app/latest");
      if (response.ok) {
        const remoteVersionRaw = await response.text();
        const remoteVer = remoteVersionRaw.trim();
        setRemoteVersion(remoteVer);
        const localVersion = require("./package.json").version;

        if (remoteVer !== localVersion) {
          setIsUpdateRequired(true);
        } else {
          setIsUpdateRequired(false);
        }
      } else {
        // Server respondió pero con error (4xx, 5xx)
        console.error("Server error:", response.status, response.statusText);
        setIsUpdateRequired(false);
      }
    } catch (error) {
      console.error("Error checking app version:", error);

      // Guardar el error para mostrarlo al usuario
      if (error instanceof NetworkError) {
        setNetworkError(error);
        // NO establecer isChecking=false aquí, se hará en el finally
        // pero tampoco queremos proceder automáticamente
      } else {
        // Para otros errores, fail open
        setIsUpdateRequired(false);
      }
    } finally {
      // Solo dejar de "checking" si no hay error de red pendiente
      // Si hay error de red, el usuario debe decidir qué hacer
      if (!networkError) {
        setIsChecking(false);
      }
    }
  }, [networkError]);

  useEffect(() => {
    const blockScreenshots = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    blockScreenshots();

    checkAppVersion();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, [checkAppVersion]);

  if (isChecking) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000066" />
        </View>
        {networkError && (
          <NetworkErrorDisplay
            error={networkError}
            onDismiss={() => {
              setNetworkError(null);
              setIsChecking(false);
              setIsUpdateRequired(false);
            }}
            onRetry={checkAppVersion}
          />
        )}
      </>
    );
  }

  if (isUpdateRequired) {
    return (
      <UpdateScreen onRetry={checkAppVersion} remoteVersion={remoteVersion} />
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
      {networkError && (
        <NetworkErrorDisplay
          error={networkError}
          onDismiss={() => setNetworkError(null)}
          onRetry={checkAppVersion}
        />
      )}
    </>
  );
}
