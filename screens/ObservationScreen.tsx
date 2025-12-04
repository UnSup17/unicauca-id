import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ObservationScreenProps {
  navigation: any;
  route: any;
}

export const ObservationScreen = ({ navigation, route }: ObservationScreenProps) => {
  const { observation } = route.params;

  const handleContinue = () => {
    navigation.navigate('Camera', { observationId: observation.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="info-outline" size={80} color={Colors.secondary} />
        </View>
        
        <Text style={styles.title}>Atención</Text>
        
        <Text style={styles.subtitle}>
          Se ha encontrado una observación sobre tu identificación:
        </Text>

        <View style={styles.card}>
          <Text style={styles.observationText}>
            {observation.nota}
          </Text>
        </View>

        <Text style={styles.instruction}>
          Para solucionar esto, es necesario que tomes una nueva foto para tu carné.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Actualizar Foto</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#fff5e6', // Light orange/yellow background
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  observationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  instruction: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
