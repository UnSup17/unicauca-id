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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getCurrentEnv, 
  setEnvironment, 
  ENVIRONMENTS, 
  Environment, 
  setDebugListener, 
  ApiDebugInfo,
  getApiDebugInfo
} from '../util/api';
import { Colors } from '../constants/Colors';

export const EnvironmentSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentEnv, setCurrentEnv] = useState<Environment>(getCurrentEnv());
  const [debugInfo, setDebugInfo] = useState<ApiDebugInfo | null>(getApiDebugInfo());
  const [showDebugPanel, setShowDebugPanel] = useState(false);

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

  const isProd = currentEnv === 'PROD';

  return (
    <>
      {/* Floating Action Button */}
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
                    currentEnv === env && styles.envOptionActive
                  ]}
                  onPress={() => handleSelectEnv(env)}
                >
                  <View>
                    <Text style={[
                      styles.envText,
                      currentEnv === env && styles.envTextActive
                    ]}>
                      {env === 'PROD' ? '🚀 Producción' : env === 'TEST' ? '🧪 Test (KubeTest)' : '🛠️ Desarrollo (Local)'}
                    </Text>
                    <Text style={styles.urlText}>{ENVIRONMENTS[env]}</Text>
                  </View>
                  {currentEnv === env && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Debug Panel Section */}
            {!isProd && (
              <View style={styles.debugSection}>
                <TouchableOpacity 
                  style={styles.debugHeader}
                  onPress={() => setShowDebugPanel(!showDebugPanel)}
                >
                  <Text style={styles.debugTitle}>🔍 Debug Panel</Text>
                  <Ionicons name={showDebugPanel ? "chevron-up" : "chevron-down"} size={20} color={Colors.gray} />
                </TouchableOpacity>

                {showDebugPanel && (
                  <ScrollView style={styles.debugScroll}>
                    {debugInfo ? (
                      <View>
                        <Text style={styles.debugLabel}>Último Endpoint:</Text>
                        <Text style={styles.debugValue}>{debugInfo.endpoint}</Text>
                        
                        <Text style={styles.debugLabel}>Estado:</Text>
                        <Text style={[
                          styles.debugValue, 
                          { color: debugInfo.status >= 200 && debugInfo.status < 300 ? '#27ae60' : '#e74c3c' }
                        ]}>
                          {debugInfo.status}
                        </Text>

                        <Text style={styles.debugLabel}>Respuesta API:</Text>
                        <View style={styles.codeBlock}>
                          <Text style={styles.codeText}>
                            {typeof debugInfo.response === 'string' 
                              ? debugInfo.response.substring(0, 1000) + (debugInfo.response.length > 1000 ? '...' : '') 
                              : JSON.stringify(debugInfo.response, null, 2)}
                          </Text>
                        </View>
                        <Text style={styles.timestamp}>
                          {new Date(debugInfo.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.noData}>No hay peticiones registradas aún.</Text>
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fabProd: {
    backgroundColor: Colors.primary,
    opacity: 0.3, // Subtle for prod
  },
  fabDebug: {
    backgroundColor: '#e67e22',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#c0392b',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  optionsList: {
    marginBottom: 20,
  },
  envOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  envOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f7ff',
  },
  envText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  envTextActive: {
    color: Colors.primary,
  },
  urlText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  debugSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  debugScroll: {
    maxHeight: 300,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 8,
  },
  debugValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  codeBlock: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 4,
    marginTop: 5,
  },
  codeText: {
    color: '#ecf0f1',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  }
});
