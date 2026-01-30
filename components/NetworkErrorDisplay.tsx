import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NetworkError } from "../util/api";

interface NetworkErrorDisplayProps {
  error: NetworkError;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function NetworkErrorDisplay({ error, onDismiss, onRetry }: NetworkErrorDisplayProps) {
  const getErrorColor = () => {
    switch (error.type) {
      case 'TIMEOUT':
        return '#FF9800'; // Orange
      case 'NETWORK':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const getErrorIcon = () => {
    switch (error.type) {
      case 'TIMEOUT':
        return '⏱️';
      case 'NETWORK':
        return '📡';
      default:
        return '⚠️';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { borderTopColor: getErrorColor() }]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.icon}>{getErrorIcon()}</Text>
            <Text style={styles.title}>Error de Red</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tipo de Error:</Text>
            <Text style={[styles.value, { color: getErrorColor() }]}>{error.type}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Mensaje:</Text>
            <Text style={styles.value}>{error.message}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>URL Solicitada:</Text>
            <Text style={styles.urlValue}>{error.url}</Text>
          </View>

          {error.details && (
            <View style={styles.section}>
              <Text style={styles.label}>Detalles Técnicos:</Text>
              <View style={styles.detailsContainer}>
                {error.details.baseUrl && (
                  <Text style={styles.detail}>• Base URL: {error.details.baseUrl}</Text>
                )}
                {error.details.endpoint && (
                  <Text style={styles.detail}>• Endpoint: {error.details.endpoint}</Text>
                )}
                {error.details.timeout && (
                  <Text style={styles.detail}>• Timeout: {error.details.timeout}ms</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.troubleshootSection}>
            <Text style={styles.troubleshootTitle}>💡 Posibles Soluciones:</Text>
            {error.type === 'TIMEOUT' && (
              <View>
                <Text style={styles.troubleshootItem}>• El servidor está tardando demasiado en responder</Text>
                <Text style={styles.troubleshootItem}>• Verifica tu conexión a internet</Text>
                <Text style={styles.troubleshootItem}>• El servidor podría estar sobrecargado</Text>
              </View>
            )}
            {error.type === 'NETWORK' && (
              <View>
                <Text style={styles.troubleshootItem}>• Verifica que tengas conexión a internet</Text>
                <Text style={styles.troubleshootItem}>• El servidor podría estar caído</Text>
                <Text style={styles.troubleshootItem}>• Verifica la URL del servidor: {error.details?.baseUrl}</Text>
                <Text style={styles.troubleshootItem}>• Si estás en desarrollo, verifica que el backend esté corriendo</Text>
              </View>
            )}
            {error.type === 'UNKNOWN' && (
              <View>
                <Text style={styles.troubleshootItem}>• Error inesperado, verifica los logs</Text>
                <Text style={styles.troubleshootItem}>• Contacta al equipo de soporte si persiste</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity 
              style={[styles.button, styles.retryButton]} 
              onPress={onRetry}
            >
              <Text style={styles.buttonText}>🔄 Reintentar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.button, styles.dismissButton]} 
            onPress={onDismiss}
          >
            <Text style={styles.buttonText}>Continuar de todas formas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderTopWidth: 4,
    overflow: 'hidden',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  urlValue: {
    fontSize: 14,
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  detailsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  troubleshootSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  troubleshootItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
  },
  dismissButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
