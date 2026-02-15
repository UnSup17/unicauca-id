import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {
  getCurrentEnv,
  setEnvironment,
  ENVIRONMENTS,
  Environment,
  setDebugListener,
  ApiDebugInfo,
  getApiDebugInfo,
  updateDevUrl,
  getDevUrl,
} from "../util/api";
import { Colors } from '../constants/Colors';

export const EnvironmentSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentEnv, setCurrentEnv] = useState<Environment>(getCurrentEnv());
  const [debugInfo, setDebugInfo] = useState<ApiDebugInfo | null>(getApiDebugInfo());
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [devIp, setDevIp] = useState(getDevUrl());

  useEffect(() => {
    setDebugListener((info) => {
      setDebugInfo(info);
    });
  }, []);

  const handleSelectEnv = async (env: Environment) => {
    await setEnvironment(env);
    setCurrentEnv(env);
    setVisible(false);
    Alert.alert(
      'Entorno Actualizado',
      `Ahora conectado a: ${env}`,
      [{ text: 'OK' }]
    );
  };

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPin, setAuthPin] = useState("");
  const [secretTaps, setSecretTaps] = useState(0);

  // Reset taps after delay
  useEffect(() => {
    if (secretTaps > 0) {
      const timer = setTimeout(() => setSecretTaps(0), 1000); // 1 second to enter 5 taps
      return () => clearTimeout(timer);
    }
  }, [secretTaps]);

  const handleSecretTap = () => {
    setSecretTaps((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAuthModal(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleAuthSubmit = () => {
    if (authPin === "2506") {
      setIsUnlocked(true);
      setShowAuthModal(false);
      setAuthPin("");
      Alert.alert("Acceso Concedido", "Modo desarrollador activado.");
    } else {
      Alert.alert("Error", "PIN incorrecto");
      setAuthPin("");
    }
  };

  const handleUpdateDevIp = async () => {
    if (!devIp) return;
    await updateDevUrl(devIp);
    const fullUrl = getDevUrl();
    setDevIp(fullUrl);

    if (currentEnv === "DEV") {
      Alert.alert("Éxito", `IP de desarrollo actualizada a: ${fullUrl}`);
    } else {
      Alert.alert(
        "IP Guardada",
        `La IP ha sido guardada. Cambia a 'Desarrollo' para usarla.`,
      );
    }
  };

  const isProd = currentEnv === 'PROD';

  return (
    <>
      {/* Secret Trigger Area - Top Left (Always active if locked) */}
      {!isUnlocked && (
        <TouchableOpacity
          style={styles.secretTrigger}
          activeOpacity={1}
          onPress={handleSecretTap}
        />
      )}

      {/* Floating Action Button - Only visible if unlocked */}
      {isUnlocked && (
        <TouchableOpacity
          style={[styles.fab, isProd ? styles.fabProd : styles.fabDebug]}
          onPress={() => setVisible(true)}
        >
          <Ionicons name="flask" size={24} color="white" />
          {!isProd && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentEnv}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Authentication Modal */}
      <Modal
        visible={showAuthModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Modo Desarrollador</Text>
            <Text style={styles.authSubtitle}>Ingrese PIN de acceso</Text>
            <TextInput
              style={styles.authInput}
              value={authPin}
              onChangeText={setAuthPin}
              placeholder="PIN"
              keyboardType="numeric"
              secureTextEntry
              autoFocus
              maxLength={4}
            />
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={[styles.authButton, styles.authButtonCancel]}
                onPress={() => {
                  setShowAuthModal(false);
                  setAuthPin("");
                }}
              >
                <Text style={styles.authButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.authButtonConfirm]}
                onPress={handleAuthSubmit}
              >
                <Text style={styles.authButtonText}>Acceder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Environment Selector Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configuración de Entorno</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={28} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>
              {(Object.keys(ENVIRONMENTS) as Environment[]).map((env) => (
                <TouchableOpacity
                  key={env}
                  style={[
                    styles.envOption,
                    currentEnv === env && styles.envOptionActive,
                  ]}
                  onPress={() => handleSelectEnv(env)}
                >
                  <View>
                    <Text
                      style={[
                        styles.envText,
                        currentEnv === env && styles.envTextActive,
                      ]}
                    >
                      {env === "PROD"
                        ? "🚀 Producción"
                        : env === "TEST"
                          ? "🧪 Test (KubeTest)"
                          : "🛠️ Desarrollo (Local)"}
                    </Text>
                    <Text style={styles.urlText}>
                      {env === "DEV" ? devIp : ENVIRONMENTS[env]}
                    </Text>
                  </View>
                  {currentEnv === env && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom IP for DEV Section */}
            <View style={styles.ipEditorSection}>
              <Text style={styles.sectionTitle}>Editar IP Local (DEV)</Text>
              <View style={styles.ipInputContainer}>
                <TextInput
                  style={styles.ipInput}
                  value={devIp}
                  onChangeText={setDevIp}
                  placeholder="ej: 192.168.1.14:8080/unid"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdateDevIp}
                >
                  <Text style={styles.updateButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                No es necesario incluir http://, se agregará automáticamente.
              </Text>
            </View>

            {/* Debug Panel Section */}
            {!isProd && (
              <View style={styles.debugSection}>
                <TouchableOpacity
                  style={styles.debugHeader}
                  onPress={() => setShowDebugPanel(!showDebugPanel)}
                >
                  <Text style={styles.debugTitle}>🔍 Debug Panel</Text>
                  <Ionicons
                    name={showDebugPanel ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={Colors.gray}
                  />
                </TouchableOpacity>

                {showDebugPanel && (
                  <ScrollView style={styles.debugScroll}>
                    {debugInfo ? (
                      <View>
                        <Text style={styles.debugLabel}>Último Endpoint:</Text>
                        <Text style={styles.debugValue}>
                          {debugInfo.endpoint}
                        </Text>

                        <Text style={styles.debugLabel}>Estado:</Text>
                        <Text
                          style={[
                            styles.debugValue,
                            {
                              color:
                                debugInfo.status >= 200 &&
                                debugInfo.status < 300
                                  ? "#27ae60"
                                  : "#e74c3c",
                            },
                          ]}
                        >
                          {debugInfo.status}
                        </Text>

                        <Text style={styles.debugLabel}>Respuesta API:</Text>
                        <View style={styles.codeBlock}>
                          <Text style={styles.codeText}>
                            {typeof debugInfo.response === "string"
                              ? debugInfo.response.substring(0, 1000) +
                                (debugInfo.response.length > 1000 ? "..." : "")
                              : JSON.stringify(debugInfo.response, null, 2)}
                          </Text>
                        </View>
                        <Text style={styles.timestamp}>
                          {new Date(debugInfo.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.noData}>
                        No hay peticiones registradas aún.
                      </Text>
                    )}
                  </ScrollView>
                )}
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  secretTrigger: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    zIndex: 99999, // Highest z-index to capture taps
    // backgroundColor: 'rgba(255, 0, 0, 0.2)', // Uncomment for debugging area
  },
  fabProd: {
    backgroundColor: Colors.primary,
    opacity: 0.3, // Subtle for prod
  },
  fabDebug: {
    backgroundColor: "#e67e22",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#c0392b",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  optionsList: {
    marginBottom: 20,
  },
  envOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  envOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: "#f0f7ff",
  },
  envText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  envTextActive: {
    color: Colors.primary,
  },
  urlText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  ipEditorSection: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 10,
  },
  ipInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ipInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#212529",
  },
  updateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  helperText: {
    fontSize: 11,
    color: "#adb5bd",
    marginTop: 5,
  },
  debugSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  debugHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  debugScroll: {
    maxHeight: 300,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
  },
  debugValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  codeBlock: {
    backgroundColor: "#2c3e50",
    padding: 10,
    borderRadius: 4,
    marginTop: 5,
  },
  codeText: {
    color: "#ecf0f1",
    fontSize: 11,
    fontFamily: "monospace",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  noData: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
    fontStyle: "italic",
  },
  authContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: "50%", // Move modal up slightly
  },
  authTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  authInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
    letterSpacing: 8, // Space out PIN digits
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  authButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  authButtonCancel: {
    backgroundColor: "#f1f1f1",
  },
  authButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333", // Default for cancel button text, override for confirm in JSX if needed
  },
});
