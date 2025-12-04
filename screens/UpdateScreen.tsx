import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

interface UpdateScreenProps {
  onRetry: () => void;
  remoteVersion?: string;
}

export const UpdateScreen = ({ onRetry, remoteVersion }: UpdateScreenProps) => {
  const updateApp = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/unicauca-id/id1552252568');
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.unicauca.id');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="system-update" size={80} color="#000066" />
        </View>
        
        <Text style={styles.title}>Actualización Requerida</Text>
        
        <Text style={styles.message}>
          Existe una nueva versión de la aplicación disponible{remoteVersion ? ` (${remoteVersion})` : ''}. 
          Es necesario actualizar desde la App Store para continuar utilizando Unicauca ID.
        </Text>

        <TouchableOpacity style={styles.button} onPress={updateApp}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#f0f0f5',
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000066',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
