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
    const setup = async () => {
      await blockScreenshots();
      await initEnvironment();
      await checkAppVersion();
    };
    setup();

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
