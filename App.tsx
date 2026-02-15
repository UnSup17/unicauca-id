import * as ScreenCapture from "expo-screen-capture";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { AppNavigator } from "./navigation/AppNavigator";
import { UpdateScreen } from "./screens/UpdateScreen";
import { apiFetch, NetworkError, initEnvironment } from "./util/api";
import { NetworkErrorDisplay } from "./components/NetworkErrorDisplay";
import { EnvironmentSwitcher } from "./components/EnvironmentSwitcher";
import ErrorBoundary from "react-native-error-boundary";
import { Text, Alert } from "react-native";

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
    let hasError = false;
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
        console.error("Server error:", response.status, response.statusText);
        setIsUpdateRequired(false);
      }
    } catch (error: any) {
      console.error("Error checking app version:", error);
      hasError = true;

      // Custom maintenance message for app/latest failure
      if (
        error instanceof NetworkError ||
        error.message.includes("Network request failed")
      ) {
        const maintenanceError = new NetworkError(
          "El servidor se encuentra en mantenimiento. Si la situación continua por favor envía un correo a contacto@unicauca.edu.co",
          "NETWORK",
          "/app/latest",
        );
        setNetworkError(maintenanceError);
      } else {
        setIsUpdateRequired(false);
      }
    } finally {
      if (!hasError) {
        setIsChecking(false);
      }
    }
  }, []); // Removed dependency on networkError to prevent loop

  useEffect(() => {
    const blockScreenshots = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    const setup = async () => {
      await blockScreenshots();
      await initEnvironment();
      checkAppVersion();
    };
    setup();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []); // Only run on mount

  if (isChecking) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000066" />
        </View>
        <EnvironmentSwitcher />
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

  const errorHandler = (error: Error, stackTrace: string) => {
    console.error("[CRITICAL_ERROR]", error, stackTrace);
  };

  return (
    <>
      <StatusBar style="dark" />
      <ErrorBoundary
        onError={errorHandler}
        FallbackComponent={({ error, resetError }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <ActivityIndicator size="large" color="#CC0000" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Se ha detectado un error inesperado
            </Text>
            <Text style={{ color: "gray", marginTop: 10, textAlign: "center" }}>
              {error.toString()}
            </Text>
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="small" color="#000066" />
              <Text style={{ fontSize: 12, color: "#999", marginTop: 5 }}>
                Usa el botón de debug para cambiar de entorno o revisar logs
              </Text>
            </View>
          </View>
        )}
      >
        <AppNavigator />
      </ErrorBoundary>
      <EnvironmentSwitcher />
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
