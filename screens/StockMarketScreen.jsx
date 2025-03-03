import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const StockMarketScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.card,
        borderBottomColor: theme.border
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Stock Market</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { 
            backgroundColor: theme.primary,
            shadowColor: isDarkMode ? '#000000' : '#000000',
          }]}
          onPress={() => navigation.navigate('StudyGuide')}
        >
          <MaterialIcons name="school" size={32} color="#FFF" />
          <Text style={styles.buttonText}>Study Guide</Text>
          <Text style={styles.buttonSubText}>Learn about stock market basics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.investButton, { 
            backgroundColor: theme.secondary || '#2196F3',
            shadowColor: isDarkMode ? '#000000' : '#000000',
          }]}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
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