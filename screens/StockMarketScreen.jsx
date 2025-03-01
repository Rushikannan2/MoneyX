import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StockMarketScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Stock Market</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('StudyGuide')}
        >
          <MaterialIcons name="school" size={32} color="#FFF" />
          <Text style={styles.buttonText}>Study Guide</Text>
          <Text style={styles.buttonSubText}>Learn about stock market basics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.investButton]}
          onPress={() => navigation.navigate('Invest')}
        >
          <MaterialIcons name="trending-up" size={32} color="#FFF" />
          <Text style={styles.buttonText}>Invest</Text>
          <Text style={styles.buttonSubText}>Start trading stocks</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  investButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonSubText: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
});

export default StockMarketScreen; 