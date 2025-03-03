import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  Switch,
  Modal,
  DateTimePicker,
  Dimensions,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useTheme } from '../context/ThemeContext';
import CurrencyConverter from '../components/CurrencyConverter';
import Header from '../components/Header';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const transactionCategories = {
  income: {
    'Salary': ['Regular Job', 'Part-time', 'Bonus', 'Overtime'],
    'Business': ['Profit', 'Sales', 'Commission'],
    'Other Income': ['Freelance', 'Rental', 'Interest', 'Gifts']
  },
  expense: {
    'Bills & Utilities': ['Electricity', 'Water', 'Internet', 'Phone', 'Gas'],
    'Housing': ['Rent', 'Mortgage', 'Maintenance', 'Property Tax'],
    'Food': ['Groceries', 'Dining Out', 'Food Delivery', 'Snacks'],
    'Transportation': ['Fuel', 'Public Transport', 'Car Maintenance', 'Parking'],
    'Healthcare': ['Medicine', 'Doctor Visit', 'Hospital', 'Insurance'],
    'Education': ['School Fee', 'College Fee', 'Books', 'Tuition', 'Courses'],
    'Personal': ['Clothing', 'Grooming', 'Gym', 'Entertainment'],
    'Others': ['Gifts', 'Donations', 'Miscellaneous']
  },
  savings: {
    'Emergency Fund': ['General Savings'],
    'Retirement': ['Pension Fund', '401k', 'IRA'],
    'Goals': ['Travel', 'Education', 'House', 'Car']
  },
  investment: {
    'Stocks': ['Individual Stocks', 'IPOs', 'Day Trading'],
    'Mutual Funds': ['Index Funds', 'ETFs', 'Sector Funds'],
    'Real Estate': ['Property', 'REITs', 'Land'],
    'Crypto': ['Bitcoin', 'Ethereum', 'Altcoins'],
    'Commodities': ['Gold', 'Silver', 'Oil']
  }
};

const HomeScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [userData, setUserData] = useState({ name: '', currency: 'USD' });
  const [transactionStats, setTransactionStats] = useState({
    income: 0,
    expense: 0,
    savings: 0,
    investment: 0,
    total: 0,
    netBalance: 0
  });
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  
  // Mascot image URL - same as in OnboardingScreen
  const mascotImageUrl = 'https://i.ytimg.com/vi/4UWoT_AIzzM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDCSCYpgDm9BY-Of8uk5DRNiBVyvg';

  useEffect(() => {
    loadUserData();
    loadTransactions();
  }, []);

  useEffect(() => {
    calculateTransactionStats();
  }, [transactions]);

  const calculateTransactionStats = () => {
    const stats = {
      income: 0,
      expense: 0,
      savings: 0,
      investment: 0,
      total: 0,
      netBalance: 0
    };

    transactions.forEach((transaction) => {
      const type = transaction.type.toLowerCase();
      const amount = transaction.amount;

      if (type === 'income') {
        stats.income += amount;
      } else if (type === 'expense') {
        stats.expense += amount;
      } else if (type === 'savings') {
        stats.savings += amount;
      } else if (type === 'investment') {
        stats.investment += amount;
      }
    });

    // Calculate net balance (income - expense)
    stats.netBalance = stats.income - stats.expense;
    
    // Set total to be the same as net balance
    stats.total = stats.netBalance;

    setTransactionStats(stats);
  };

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleAddTransaction = async () => {
    if (!transactionAmount || !selectedMainCategory || !selectedSubCategory) {
      Alert.alert('Error', 'Please enter amount and select both category and subcategory');
      return;
    }

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Ensure transaction type is lowercase for consistency
    const type = transactionType.toLowerCase();
    console.log('Adding transaction with type:', type);
    
    // If we're editing an existing transaction
    if (editingTransactionId) {
      handleUpdateTransaction();
      return;
    }
    
    // Otherwise, add a new transaction
    const newTransaction = {
      id: Date.now().toString(),
      amount,
      type: type,
      mainCategory: selectedMainCategory,
      subCategory: selectedSubCategory,
      date: new Date(),
      currency: userData.currency
    };

    console.log('Adding new transaction:', newTransaction);

    const updatedTransactions = [newTransaction, ...transactions];
    
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      // Update transactions state
      setTransactions(updatedTransactions);
      // Recalculate stats immediately
      calculateTransactionStats();
      setShowAddTransaction(false);
      resetTransactionForm();
      
      // Show success message
      Alert.alert('Success', 'Transaction added successfully');
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const handleEditTransaction = (transaction) => {
    // Set the form values to the transaction values
    setTransactionAmount(transaction.amount.toString());
    setTransactionType(transaction.type);
    setSelectedMainCategory(transaction.mainCategory);
    setSelectedSubCategory(transaction.subCategory);
    
    // Store the transaction ID to be edited
    setEditingTransactionId(transaction.id);
    
    // Open the modal
    setShowAddTransaction(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedTransactions = transactions.filter(
              transaction => transaction.id !== transactionId
            );
            
            try {
              await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
              // Update transactions state
              setTransactions(updatedTransactions);
              // Recalculate stats immediately
              calculateTransactionStats();
              
              // Show success message
              Alert.alert('Success', 'Transaction deleted successfully');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          }
        }
      ]
    );
  };

  const handleUpdateTransaction = async () => {
    if (!transactionAmount || !selectedMainCategory || !selectedSubCategory) {
      Alert.alert('Error', 'Please enter amount and select both category and subcategory');
      return;
    }

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Ensure transaction type is lowercase for consistency
    const type = transactionType.toLowerCase();
    
    // Find the transaction to update
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === editingTransactionId) {
        return {
          ...transaction,
          amount,
          type,
          mainCategory: selectedMainCategory,
          subCategory: selectedSubCategory,
          modified: new Date() // Add a modified timestamp
        };
      }
      return transaction;
    });

    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      // Update transactions state
      setTransactions(updatedTransactions);
      // Recalculate stats immediately
      calculateTransactionStats();
      setShowAddTransaction(false);
      resetTransactionForm();
      setEditingTransactionId(null);
      
      // Show success message
      Alert.alert('Success', 'Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Failed to update transaction');
    }
  };

  const resetTransactionForm = () => {
    setTransactionAmount('');
    setTransactionType('');
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    setEditingTransactionId(null);
    
    // Log form reset for debugging
    console.log('Transaction form reset');
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'income':
        return '#00E676'; // Brighter green
      case 'expense':
        return '#FF5252'; // Brighter red
      case 'savings':
        return '#FFC107'; // Yellow
      case 'investment':
        return '#2196F3'; // Blue
      default:
        return theme.text || '#1f2937';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'income':
        return '#10b981'; // Green
      case 'expense':
        return '#ef4444'; // Red
      case 'savings':
        return '#1e40af'; // Dark Blue
      case 'investment':
        return '#8e44ad'; // Purple
      default:
        return theme.text || '#1f2937';
    }
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTransactionTypeSelect = (type) => {
    console.log('Selected transaction type:', type);
    setTransactionType(type);
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    
    // Log available categories for debugging
    console.log('Available categories:', Object.keys(transactionCategories[type.toLowerCase()] || {}));
  };

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory('');
    
    // Log available subcategories for debugging
    console.log('Available subcategories:', 
      transactionCategories[transactionType.toLowerCase()][category] || []);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const renderDistributionBar = () => {
    // Calculate total of absolute values for proper percentage distribution
    const totalTransactions = Math.abs(transactionStats.income) + 
                            Math.abs(transactionStats.expense) + 
                            Math.abs(transactionStats.savings) + 
                            Math.abs(transactionStats.investment);
                            
    if (totalTransactions === 0) return null;
    
    // Calculate percentages based on absolute values
    const incomeWidth = (Math.abs(transactionStats.income) / totalTransactions) * 100;
    const expenseWidth = (Math.abs(transactionStats.expense) / totalTransactions) * 100;
    const savingsWidth = (Math.abs(transactionStats.savings) / totalTransactions) * 100;
    const investmentWidth = (Math.abs(transactionStats.investment) / totalTransactions) * 100;
    
    return (
      <View style={styles.distributionContainer}>
        <Text style={[styles.distributionTitle, { color: theme.text }]}>Distribution</Text>
        <View style={styles.distributionBar}>
          <View style={[styles.distributionSegment, { width: `${incomeWidth}%`, backgroundColor: '#00E676' }]} />
          <View style={[styles.distributionSegment, { width: `${expenseWidth}%`, backgroundColor: '#FF5252' }]} />
          <View style={[styles.distributionSegment, { width: `${savingsWidth}%`, backgroundColor: '#FFC107' }]} />
          <View style={[styles.distributionSegment, { width: `${investmentWidth}%`, backgroundColor: '#2196F3' }]} />
        </View>
        <View style={styles.distributionLabels}>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#00E676' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Income</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#FF5252' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Expense</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#FFC107' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Savings</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#2196F3' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Investment</Text>
          </View>
        </View>
        
        <View style={styles.distributionValues}>
          <Text style={[styles.distributionValueText, { color: theme.text, fontSize: 13 }]} numberOfLines={1}>
            Income: {userData.currency} {transactionStats.income.toFixed(0)} ({incomeWidth.toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text, fontSize: 13 }]} numberOfLines={1}>
            Expense: {userData.currency} {transactionStats.expense.toFixed(0)} ({expenseWidth.toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text, fontSize: 13 }]} numberOfLines={1}>
            Savings: {userData.currency} {transactionStats.savings.toFixed(0)} ({savingsWidth.toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text, fontSize: 13 }]} numberOfLines={1}>
            Investment: {userData.currency} {transactionStats.investment.toFixed(0)} ({investmentWidth.toFixed(1)}%)
          </Text>
        </View>
      </View>
    );
  };

  const clearAllTransactions = async () => {
    try {
      await AsyncStorage.removeItem('transactions');
      setTransactions([]);
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  };

  // Function to generate pie chart data
  const generatePieChartData = () => {
    if (transactions.length === 0) {
      return [{
        name: 'No Data',
        population: 1,
        color: isDarkMode ? '#4a4a4a' : '#e0e0e0',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16
      }];
    }

    const totalTransactions = Math.abs(transactionStats.income) + 
                            Math.abs(transactionStats.expense) + 
                            Math.abs(transactionStats.savings) + 
                            Math.abs(transactionStats.investment);
                            
    if (totalTransactions === 0) {
      return [{
        name: 'No Data',
        population: 1,
        color: isDarkMode ? '#4a4a4a' : '#e0e0e0',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16
      }];
    }
    
    const data = [];
    
    if (transactionStats.income > 0) {
      const percentage = ((Math.abs(transactionStats.income) / totalTransactions) * 100).toFixed(1);
      data.push({
        name: `Income`,
        population: Math.abs(transactionStats.income),
        color: isDarkMode ? '#81C784' : '#388E3C',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16,
        percentage: percentage,
        amount: transactionStats.income
      });
    }
    
    if (transactionStats.expense > 0) {
      const percentage = ((Math.abs(transactionStats.expense) / totalTransactions) * 100).toFixed(1);
      data.push({
        name: `Expense`,
        population: Math.abs(transactionStats.expense),
        color: isDarkMode ? '#FF6B6B' : '#D32F2F',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16,
        percentage: percentage,
        amount: transactionStats.expense
      });
    }
    
    if (transactionStats.savings > 0) {
      const percentage = ((Math.abs(transactionStats.savings) / totalTransactions) * 100).toFixed(1);
      data.push({
        name: `Savings`,
        population: Math.abs(transactionStats.savings),
        color: isDarkMode ? '#F06292' : '#C2185B',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16,
        percentage: percentage,
        amount: transactionStats.savings
      });
    }
    
    if (transactionStats.investment > 0) {
      const percentage = ((Math.abs(transactionStats.investment) / totalTransactions) * 100).toFixed(1);
      data.push({
        name: `Investment`,
        population: Math.abs(transactionStats.investment),
        color: isDarkMode ? '#26A69A' : '#00897B',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 16,
        percentage: percentage,
        amount: transactionStats.investment
      });
    }
    
    return data;
  };

  // Generate category-based pie chart data
  const generateCategoryPieChartData = () => {
    if (transactions.length === 0) {
      return [{
        name: 'No Data',
        population: 1,
        color: isDarkMode ? '#4a4a4a' : '#e0e0e0',
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 14
      }];
    }

    const categoryTotals = {};
    const categoryTypes = {};
    
    transactions.forEach(transaction => {
      if (!categoryTotals[transaction.mainCategory]) {
        categoryTotals[transaction.mainCategory] = 0;
        categoryTypes[transaction.mainCategory] = transaction.type;
      }
      categoryTotals[transaction.mainCategory] += Math.abs(transaction.amount);
    });
    
    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + Math.abs(amount), 0);
    
    const getColorForCategory = (category, type) => {
      const colors = {
        expense: {
          'Bills & Utilities': isDarkMode ? '#FF6B6B' : '#D32F2F',
          'Housing': isDarkMode ? '#FFB74D' : '#FFA000',
          'Food': isDarkMode ? '#FFD54F' : '#FBC02D',
          'Transportation': isDarkMode ? '#64B5F6' : '#1976D2',
          'Healthcare': isDarkMode ? '#9575CD' : '#7B1FA2',
          'Education': isDarkMode ? '#4DB6AC' : '#00796B',
          'Personal': isDarkMode ? '#E57373' : '#C2185B',
          'Others': isDarkMode ? '#A1887F' : '#5D4037'
        },
        income: {
          'Salary': isDarkMode ? '#81C784' : '#388E3C',
          'Business': isDarkMode ? '#FF8A65' : '#E64A19',
          'Other Income': isDarkMode ? '#BA68C8' : '#512DA8'
        },
        savings: {
          'Emergency Fund': isDarkMode ? '#F06292' : '#C2185B',
          'Retirement': isDarkMode ? '#7986CB' : '#303F9F',
          'Goals': isDarkMode ? '#DCE775' : '#AFB42B'
        },
        investment: {
          'Stocks': isDarkMode ? '#26A69A' : '#00897B',
          'Real Estate': isDarkMode ? '#8D6E63' : '#6D4C41',
          'Crypto': isDarkMode ? '#FF7043' : '#D84315',
          'Commodities': isDarkMode ? '#BDBDBD' : '#757575'
        }
      };

      return colors[type]?.[category] || (isDarkMode ? '#A1887F' : '#5D4037');
    };

    const data = Object.entries(categoryTotals).map(([category, amount]) => {
      const type = categoryTypes[category];
      const percentage = ((Math.abs(amount) / totalAmount) * 100).toFixed(1);
      return {
        name: category,
        type: type,
        population: Math.abs(amount),
        color: getColorForCategory(category, type),
        legendFontColor: isDarkMode ? '#ffffff' : '#000000',
        legendFontSize: 14,
        percentage: percentage,
        amount: amount
      };
    });
    
    return data.sort((a, b) => b.population - a.population);
  };

  const visibleTransactions = showAllTransactions ? transactions : transactions.slice(0, 10);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        userData={userData}
        theme={theme}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Add Chatbot Icon */}
      <TouchableOpacity
        style={[styles.chatbotButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContainer}>
          <View style={[styles.imageContainer, {
            backgroundColor: theme.card,
            marginVertical: 15,
            marginHorizontal: -15,
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            height: 250,
          }]}>
            <Image
              source={{ uri: 'https://i.imgur.com/kX1FrLI.png' }}
              style={[styles.bannerImage, {
                width: '100%',
                height: '100%',
                resizeMode: 'contain'
              }]}
            />
          </View>
          
          <View style={[styles.headerTop, { 
            backgroundColor: theme.primary, 
            marginHorizontal: -15,
            marginTop: -10,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 0,
            marginBottom: 20
          }]}>
            <Text style={[styles.welcomeText, { color: '#ffffff', fontSize: 22 }]}>
              Welcome, {userData?.name || 'User'}!
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.headerButton]}
                onPress={() => setShowCurrencyConverter(true)}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonEmoji}>🔄</Text>
                  <Text style={styles.buttonText}>Currency Converter</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.headerButton]}
                onPress={toggleTheme}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonEmoji}>🌓</Text>
                  <Text style={styles.buttonText}>Themes</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.headerButton]}
                onPress={() => navigation.navigate('StockMarket')}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonEmoji}>📈</Text>
                  <Text style={styles.buttonText}>Stocks</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.headerButton]}
                onPress={() => setShowVisualization(true)}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonEmoji}>📊</Text>
                  <Text style={styles.buttonText}>Charts</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { 
              backgroundColor: theme.primary,
              marginBottom: 20,
              borderRadius: 15,
              height: 60,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }]}
            onPress={() => setShowAddTransaction(true)}
          >
            <MaterialCommunityIcons name="plus-circle" size={32} color="#ffffff" />
            <Text style={[styles.addButtonText, { fontSize: 18, fontWeight: 'bold' }]}>ADD NEW TRANSACTION</Text>
          </TouchableOpacity>

          <View style={[styles.balanceCard, { 
            backgroundColor: theme.primary,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }]}>
            <Text style={[styles.balanceLabel, { color: '#ffffff' }]}>
              Total Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: '#ffffff', fontSize: 36 }]}>
              {userData.currency || '$'} {transactionStats.netBalance.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.distributionContainer, {
            backgroundColor: theme.card,
            padding: 15,
            borderRadius: 15,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }]}>
            <Text style={[styles.distributionTitle, { color: theme.text, fontSize: 20, marginBottom: 15 }]}>
              Distribution Chart
            </Text>
            
            {renderDistributionBar()}
          </View>

          <View style={styles.recentTransactions}>
            <View style={[styles.sectionHeader, { 
              backgroundColor: theme.card,
              padding: 15,
              borderRadius: 15,
              marginBottom: 15
            }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Transactions
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Clear Transactions',
                    'Are you sure you want to clear all transactions?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Clear', onPress: clearAllTransactions, style: 'destructive' }
                    ]
                  );
                }}
              >
                <MaterialCommunityIcons name="delete" size={24} color={theme.error} />
              </TouchableOpacity>
            </View>
            
            {transactions.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No transactions yet
              </Text>
            ) : (
              <>
                {visibleTransactions.map((transaction, index) => (
                  <View 
                    key={index} 
                    style={[styles.transactionItem, { 
                      backgroundColor: theme.card,
                      marginBottom: 10,
                      padding: 15,
                      borderRadius: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }]}
                  >
                    <View style={styles.transactionIcon}>
                      <MaterialCommunityIcons 
                        name={
                          transaction.type === 'income' ? 'arrow-down-circle' : 
                          transaction.type === 'expense' ? 'arrow-up-circle' : 
                          transaction.type === 'savings' ? 'bank' :
                          transaction.type === 'investment' ? 'chart-pie' : 'bank'
                        } 
                        size={28} 
                        color={getIconColor(transaction.type)} 
                      />
                    </View>
                    <View style={[styles.transactionDetails, { 
                      flex: 1,
                      marginRight: 15,
                      justifyContent: 'center'
                    }]}>
                      <Text style={[styles.transactionCategory, { 
                        color: theme.text,
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 4,
                        lineHeight: 20
                      }]} numberOfLines={2}>
                        {transaction.mainCategory}
                        {transaction.subCategory ? ` - ${transaction.subCategory}` : ''}
                      </Text>
                      <Text style={[styles.transactionDate, { 
                        color: theme.subtext,
                        fontSize: 12
                      }]} numberOfLines={1}>
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
                      <Text style={[
                        styles.transactionAmount, 
                        { 
                          color: getIconColor(transaction.type),
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginBottom: 4,
                          textAlign: 'right'
                        }
                      ]}>
                        {transaction.type === 'expense' ? '-' : '+'}{userData.currency || '$'} {transaction.amount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.transactionActions}>
                      <TouchableOpacity
                        onPress={() => handleEditTransaction(transaction)}
                        style={[styles.actionIcon, { 
                          backgroundColor: theme.primary,
                          marginRight: 8
                        }]}
                      >
                        <MaterialCommunityIcons name="pencil" size={16} color="#ffffff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(transaction.id)}
                        style={[styles.actionIcon, { backgroundColor: theme.error }]}
                      >
                        <MaterialCommunityIcons name="delete" size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                {transactions.length > 10 && (
                  <TouchableOpacity
                    style={[styles.viewMoreButton, {
                      backgroundColor: theme.primary,
                      padding: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                      marginTop: 10,
                      marginBottom: 20,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8
                    }]}
                    onPress={() => setShowAllTransactions(!showAllTransactions)}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
                      {showAllTransactions ? 'Show Less' : 'View All Transactions'}
                    </Text>
                    <MaterialCommunityIcons 
                      name={showAllTransactions ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#ffffff" 
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      
      <CurrencyConverter 
        visible={showCurrencyConverter} 
        onClose={() => setShowCurrencyConverter(false)} 
      />

      <Modal
        visible={showVisualization}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVisualization(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.modalTitle}>Charts & Analysis</Text>
              <TouchableOpacity 
                onPress={() => setShowVisualization(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={true}
            >
              {/* Transaction Distribution Chart */}
              <View style={[styles.chartContainer, { 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  },
                  android: {
                    elevation: 5,
                  },
                }),
              }]}>
                <Text style={[styles.chartTitle, { 
                  color: isDarkMode ? '#ffffff' : '#000000',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                  textAlign: 'center'
                }]}>
                  Transaction Distribution
                </Text>

                {transactions.length === 0 ? (
                  <View style={styles.emptyChart}>
                    <MaterialCommunityIcons 
                      name="chart-pie" 
                      size={40} 
                      color={isDarkMode ? '#4a4a4a' : '#e0e0e0'} 
                    />
                    <Text style={[styles.emptyText, { 
                      color: isDarkMode ? '#ffffff' : '#000000',
                      marginTop: 8
                    }]}>
                      No transactions yet
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={[styles.chartWrapper, { alignItems: 'center' }]}>
                      <PieChart
                        data={generatePieChartData()}
                        width={width - 32}
                        height={180}
                        chartConfig={{
                          color: (opacity = 1) => isDarkMode 
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                          labelColor: (opacity = 1) => isDarkMode 
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                          style: {
                            borderRadius: 16
                          },
                          propsForLabels: {
                            fontSize: 16,
                            fontWeight: 'bold'
                          }
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        absolute
                        hasLegend={false}
                      />
                    </View>

                    <View style={[styles.legendContainer, {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      padding: 16,
                      marginTop: 20
                    }]}>
                      {generatePieChartData().map((item, index) => (
                        <View key={index} style={[styles.legendRow, {
                          borderBottomWidth: index < generatePieChartData().length - 1 ? 1 : 0,
                          borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          paddingVertical: 12,
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 8
                        }]}>
                          <View style={[styles.legendItem, { width: '100%' }]}>
                            <View style={[styles.legendDot, { 
                              backgroundColor: item.color,
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              marginRight: 10
                            }]} />
                            <Text style={[styles.legendText, { 
                              color: isDarkMode ? '#ffffff' : '#000000',
                              fontSize: 16,
                              fontWeight: '600'
                            }]} numberOfLines={1}>
                              {item.name} ({item.percentage}%)
                            </Text>
                          </View>
                          <Text style={[styles.legendAmount, { 
                            color: item.color,
                            fontSize: 18,
                            fontWeight: '700',
                            marginLeft: 22
                          }]} numberOfLines={1}>
                            {userData.currency} {Math.abs(item.amount).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>

              {/* Category Distribution Chart */}
              <View style={[styles.chartContainer, { 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  },
                  android: {
                    elevation: 5,
                  },
                }),
              }]}>
                <Text style={[styles.chartTitle, { 
                  color: isDarkMode ? '#ffffff' : '#000000',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                  textAlign: 'center'
                }]}>
                  Category Distribution
                </Text>

                {transactions.length === 0 ? (
                  <View style={styles.emptyChart}>
                    <MaterialCommunityIcons 
                      name="chart-pie" 
                      size={40} 
                      color={isDarkMode ? '#4a4a4a' : '#e0e0e0'} 
                    />
                    <Text style={[styles.emptyText, { 
                      color: isDarkMode ? '#ffffff' : '#000000',
                      marginTop: 8
                    }]}>
                      No transactions yet
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={[styles.chartWrapper, { alignItems: 'center' }]}>
                      <PieChart
                        data={generateCategoryPieChartData()}
                        width={width - 32}
                        height={180}
                        chartConfig={{
                          color: (opacity = 1) => isDarkMode 
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                          labelColor: (opacity = 1) => isDarkMode 
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                          style: {
                            borderRadius: 16
                          },
                          propsForLabels: {
                            fontSize: 16,
                            fontWeight: 'bold'
                          }
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        absolute
                        hasLegend={false}
                      />
                    </View>

                    <View style={[styles.legendContainer, {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      padding: 16,
                      marginTop: 20
                    }]}>
                      {generateCategoryPieChartData().map((item, index) => (
                        <View key={index} style={[styles.legendRow, {
                          borderBottomWidth: index < generateCategoryPieChartData().length - 1 ? 1 : 0,
                          borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          paddingVertical: 12,
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 8
                        }]}>
                          <View style={[styles.legendItem, { width: '100%' }]}>
                            <View style={[styles.legendDot, { 
                              backgroundColor: item.color,
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              marginRight: 10
                            }]} />
                            <Text style={[styles.legendText, { 
                              color: isDarkMode ? '#ffffff' : '#000000',
                              fontSize: 16,
                              fontWeight: '600'
                            }]} numberOfLines={1}>
                              {item.name} ({item.percentage}%)
                            </Text>
                          </View>
                          <Text style={[styles.legendAmount, { 
                            color: item.color,
                            fontSize: 18,
                            fontWeight: '700',
                            marginLeft: 22
                          }]} numberOfLines={1}>
                            {userData.currency} {Math.abs(item.amount).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>

              {/* Transaction Summary Section */}
              <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  Transaction Summary
                </Text>

                <View style={styles.summaryContainer}>
                  {/* Net Balance */}
                  <View style={[styles.summaryCard, { backgroundColor: theme.background }]}>
                    <Text style={[styles.summaryLabel, { color: theme.text }]}>Net Balance</Text>
                    <Text style={[styles.summaryAmount, { 
                      color: transactionStats.netBalance > 0 ? '#00E676' : '#FF5252',
                      fontSize: 24,
                      fontWeight: 'bold'
                    }]}>
                      {userData.currency || '$'} {transactionStats.netBalance.toFixed(2)}
                    </Text>
                  </View>

                  {/* Total Income vs Expenses */}
                  <View style={[styles.summaryRow, { borderBottomColor: theme.border }]}>
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryLabel, { color: theme.text }]}>Total Income</Text>
                      <Text style={[styles.summaryAmount, { color: '#00E676' }]}>
                        {userData.currency || '$'} {transactionStats.income.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryLabel, { color: theme.text }]}>Total Expenses</Text>
                      <Text style={[styles.summaryAmount, { color: '#FF5252' }]}>
                        {userData.currency || '$'} {transactionStats.expense.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Savings & Investments */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryLabel, { color: theme.text }]}>Total Savings</Text>
                      <Text style={[styles.summaryAmount, { color: '#FFC107' }]}>
                        {userData.currency || '$'} {transactionStats.savings.toFixed(2)}
                      </Text>
                      <Text style={[styles.summaryPercentage, { color: theme.subtext }]}>
                        {((transactionStats.savings / transactionStats.total) * 100).toFixed(1)}% of total
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryLabel, { color: theme.text }]}>Total Investments</Text>
                      <Text style={[styles.summaryAmount, { color: '#2196F3' }]}>
                        {userData.currency || '$'} {transactionStats.investment.toFixed(2)}
                      </Text>
                      <Text style={[styles.summaryPercentage, { color: theme.subtext }]}>
                        {((transactionStats.investment / transactionStats.total) * 100).toFixed(1)}% of total
                      </Text>
                    </View>
                  </View>

                  {/* Financial Health Indicators */}
                  <View style={[styles.healthIndicators, { borderTopColor: theme.border }]}>
                    <Text style={[styles.healthTitle, { color: theme.text }]}>Financial Health</Text>
                    <Text style={[styles.healthText, { color: theme.text }]}>
                      {transactionStats.savings + transactionStats.investment > 0 
                        ? `You're saving/investing ${(((transactionStats.savings + transactionStats.investment) / transactionStats.total) * 100).toFixed(1)}% of your money`
                        : "Consider starting to save or invest"}
                    </Text>
                    <Text style={[styles.healthText, { color: theme.text }]}>
                      {transactionStats.income > transactionStats.expense
                        ? `Positive cash flow: ${userData.currency || '$'} ${(transactionStats.income - transactionStats.expense).toFixed(2)}`
                        : "Warning: Expenses exceed income"}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddTransaction}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowAddTransaction(false);
          resetTransactionForm();
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={[styles.modalOverlay, {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.95)',
          }]}>
            <View style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.card,
                padding: 0,
                overflow: 'hidden',
                width: '95%',
                maxHeight: '95%',
                borderRadius: 20,
                marginTop: 'auto',
                marginBottom: 'auto',
              }
            ]}>
              <View style={[styles.modalHeader, { 
                backgroundColor: theme.primary,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingVertical: 15,
                paddingHorizontal: 15,
              }]}>
                <Text style={[styles.modalTitle, { color: '#ffffff', fontSize: 24, fontWeight: 'bold' }]}>
                  {editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddTransaction(false);
                    resetTransactionForm();
                  }}
                  style={[styles.closeButton, { 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: 8,
                    borderRadius: 20
                  }]}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={28}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={{ backgroundColor: theme.background, maxHeight: '85%' }} 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15, paddingTop: 15 }}
              >
                <View style={[styles.formSection, { 
                  marginTop: 10, 
                  backgroundColor: theme.card, 
                  padding: 15, 
                  borderRadius: 15,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }]}>
                  <Text style={[styles.formLabel, { color: theme.text, fontSize: 20, fontWeight: 'bold' }]}>
                    Amount
                  </Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.border,
                      borderWidth: 1,
                      fontSize: 24,
                      height: 65,
                      fontWeight: 'bold'
                    }]}
                    placeholder="Enter Amount"
                    placeholderTextColor={theme.subtext}
                    value={transactionAmount}
                    onChangeText={setTransactionAmount}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formSection, { 
                  marginTop: 20, 
                  backgroundColor: theme.card, 
                  padding: 15, 
                  borderRadius: 15, 
                  shadowColor: "#000", 
                  shadowOffset: { width: 0, height: 2 }, 
                  shadowOpacity: 0.2, 
                  shadowRadius: 3, 
                  elevation: 4 
                }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 22, fontWeight: 'bold' }]}>
                    Select Transaction Type
                  </Text>
                  <View style={[styles.typeSelector, { 
                    marginTop: 10,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: 15
                  }]}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'income' ? '#00E676' : 'rgba(0, 230, 118, 0.2)',
                          borderWidth: transactionType === 'income' ? 0 : 1,
                          borderColor: '#00E676',
                          height: 100,
                          width: '47%',
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          elevation: 8,
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('income')}
                    >
                      <MaterialCommunityIcons 
                        name="arrow-down-circle" 
                        size={40} 
                        color={transactionType === 'income' ? '#ffffff' : '#00E676'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'income' ? '#ffffff' : '#00E676', fontSize: 18, fontWeight: 'bold', marginTop: 8 }
                      ]}>
                        Income
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'expense' ? '#FF5252' : 'rgba(255, 82, 82, 0.2)',
                          borderWidth: transactionType === 'expense' ? 0 : 1,
                          borderColor: '#FF5252',
                          height: 100,
                          width: '47%',
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          elevation: 8,
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('expense')}
                    >
                      <MaterialCommunityIcons 
                        name="arrow-up-circle" 
                        size={40} 
                        color={transactionType === 'expense' ? '#ffffff' : '#FF5252'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'expense' ? '#ffffff' : '#FF5252', fontSize: 18, fontWeight: 'bold', marginTop: 8 }
                      ]}>
                        Expense
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'savings' ? '#448AFF' : 'rgba(68, 138, 255, 0.2)',
                          borderWidth: transactionType === 'savings' ? 0 : 1,
                          borderColor: '#448AFF',
                          height: 100,
                          width: '47%',
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          elevation: 8,
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('savings')}
                    >
                      <MaterialCommunityIcons 
                        name="bank" 
                        size={40} 
                        color={transactionType === 'savings' ? '#ffffff' : '#448AFF'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'savings' ? '#ffffff' : '#448AFF', fontSize: 18, fontWeight: 'bold', marginTop: 8 }
                      ]}>
                        Savings
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'investment' ? '#AA00FF' : 'rgba(170, 0, 255, 0.2)',
                          borderWidth: transactionType === 'investment' ? 0 : 1,
                          borderColor: '#AA00FF',
                          height: 100,
                          width: '47%',
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          elevation: 8,
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('investment')}
                    >
                      <MaterialCommunityIcons 
                        name="chart-pie" 
                        size={40} 
                        color={transactionType === 'investment' ? '#ffffff' : '#AA00FF'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'investment' ? '#ffffff' : '#AA00FF', fontSize: 18, fontWeight: 'bold', marginTop: 8 }
                      ]}>
                        Investment
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {transactionType && (
                  <View style={[styles.formSection, { 
                    backgroundColor: theme.card, 
                    padding: 15, 
                    borderRadius: 15,
                    marginTop: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 4,
                  }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 20, fontWeight: 'bold' }]}>
                      Select Category
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={true}
                      contentContainerStyle={{ paddingBottom: 10 }}
                    >
                      <View style={styles.categoryGrid}>
                        {Object.keys(transactionCategories[transactionType.toLowerCase()] || {}).map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              styles.categoryCard,
                              {
                                backgroundColor: selectedMainCategory === category 
                                  ? getIconColor(transactionType) 
                                  : theme.background,
                                borderColor: getIconColor(transactionType),
                                borderWidth: 2,
                                marginRight: 15,
                                minWidth: 150,
                                height: 60,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 3,
                              }
                            ]}
                            onPress={() => handleMainCategorySelect(category)}
                          >
                            <Text style={[
                              styles.categoryCardText,
                              { 
                                color: selectedMainCategory === category ? '#ffffff' : theme.text,
                                fontSize: 16,
                                fontWeight: 'bold'
                              },
                            ]}>
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {selectedMainCategory && (
                  <View style={[styles.formSection, { 
                    backgroundColor: theme.card, 
                    padding: 15, 
                    borderRadius: 15,
                    marginTop: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 4,
                  }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 20, fontWeight: 'bold' }]}>
                      Select Subcategory
                    </Text>
                    <View style={styles.subCategoryGrid}>
                      {(transactionCategories[transactionType.toLowerCase()] && 
                        transactionCategories[transactionType.toLowerCase()][selectedMainCategory] || []).map((subCategory) => (
                        <TouchableOpacity
                          key={subCategory}
                          style={[
                            styles.subCategoryCard,
                            {
                              backgroundColor: selectedSubCategory === subCategory 
                                ? getIconColor(transactionType) 
                                : theme.background,
                              borderColor: getIconColor(transactionType),
                              borderWidth: 2,
                              height: 55,
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowRadius: 2,
                              elevation: 3,
                            }
                          ]}
                          onPress={() => handleSubCategorySelect(subCategory)}
                        >
                          <Text style={[
                            styles.categoryCardText,
                            { 
                              color: selectedSubCategory === subCategory ? '#ffffff' : theme.text,
                              fontSize: 16,
                              fontWeight: 'bold'
                            },
                          ]}>
                            {subCategory}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={[styles.actionButtons, { marginTop: 20 }]}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: (!transactionAmount || !transactionType || !selectedMainCategory || !selectedSubCategory) 
                          ? 'rgba(128,128,128,0.5)' 
                          : theme.primary,
                        height: 60
                      }
                    ]}
                    onPress={handleAddTransaction}
                    disabled={!transactionAmount || !transactionType || !selectedMainCategory || !selectedSubCategory}
                  >
                    <Text style={[styles.actionButtonText, { fontSize: 20 }]}>
                      {editingTransactionId ? 'Update Transaction' : 'Add Transaction'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton, { height: 60 }]}
                    onPress={() => {
                      setShowAddTransaction(false);
                      resetTransactionForm();
                    }}
                  >
                    <Text style={[styles.cancelButtonText, { fontSize: 20 }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 15,
  },
  headerTop: {
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
    width: '100%',
  },
  headerButton: {
    flex: 1,
    minWidth: 140,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    transform: [{ scale: 1 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonEmoji: {
    fontSize: 20,
    color: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  distributionContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  distributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  distributionBar: {
    height: 25,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  distributionSegment: {
    height: '100%',
  },
  distributionLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  labelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  distributionValues: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  distributionValueText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recentTransactions: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 10,
  },
  transactionCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    height: 200,
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  legendContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
    marginRight: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  categoryCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryCardText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  subCategoryCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  viewMoreButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginHorizontal: -15,
    marginTop: -10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  chatbotButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
});

export default HomeScreen;