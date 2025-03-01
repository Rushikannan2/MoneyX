import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD'];
const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$',
};

// Simplified conversion rates for example
const conversionRates = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, INR: 74.5, AUD: 1.35 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, INR: 87.8, AUD: 1.59 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 150.6, INR: 102.1, AUD: 1.85 },
  JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, INR: 0.68, AUD: 0.012 },
  INR: { USD: 0.013, EUR: 0.011, GBP: 0.0098, JPY: 1.47, AUD: 0.018 },
  AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, INR: 54.9 },
};

const CurrencyConverter = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const handleConversion = () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) return;

    let result;
    if (fromCurrency === toCurrency) {
      result = inputAmount;
    } else {
      result = inputAmount * conversionRates[fromCurrency][toCurrency];
    }

    setConvertedAmount(result.toFixed(2));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Currency Converter
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.converterContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.amountInput, {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                }]}
                placeholder="Enter amount"
                placeholderTextColor={theme.subtext}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                onSubmitEditing={handleConversion}
              />
            </View>

            <View style={styles.currencySelectors}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {currencies.map((currency) => (
                  <TouchableOpacity
                    key={`from-${currency}`}
                    style={[
                      styles.currencyButton,
                      {
                        backgroundColor: fromCurrency === currency ? theme.primary : theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setFromCurrency(currency)}
                  >
                    <Text style={[
                      styles.currencyText,
                      { color: fromCurrency === currency ? '#ffffff' : theme.text },
                    ]}>
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <MaterialCommunityIcons
                name="arrow-down"
                size={24}
                color={theme.primary}
                style={styles.arrowIcon}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {currencies.map((currency) => (
                  <TouchableOpacity
                    key={`to-${currency}`}
                    style={[
                      styles.currencyButton,
                      {
                        backgroundColor: toCurrency === currency ? theme.primary : theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setToCurrency(currency)}
                  >
                    <Text style={[
                      styles.currencyText,
                      { color: toCurrency === currency ? '#ffffff' : theme.text },
                    ]}>
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.convertButton, { backgroundColor: theme.primary }]}
              onPress={handleConversion}
            >
              <Text style={styles.convertButtonText}>Convert</Text>
            </TouchableOpacity>

            {convertedAmount && (
              <View style={[styles.resultContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.resultText, { color: theme.text }]}>
                  {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                </Text>
                <Text style={[styles.rateText, { color: theme.subtext }]}>
                  1 {fromCurrency} = {conversionRates[fromCurrency][toCurrency].toFixed(4)} {toCurrency}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  converterContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  amountInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  currencySelectors: {
    gap: 15,
  },
  currencyScroll: {
    flexGrow: 0,
  },
  currencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  convertButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CurrencyConverter; 