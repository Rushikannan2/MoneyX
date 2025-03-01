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
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    total: 0
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
      total: 0
    };

    console.log('Starting transaction stats calculation with', transactions.length, 'transactions');
    
    transactions.forEach((transaction, index) => {
      // Make sure we're using the correct transaction type
      const type = transaction.type.toLowerCase();
      
      // Log each transaction for debugging
      console.log(`Transaction ${index + 1}:`, {
        id: transaction.id,
        type: type,
        originalType: transaction.type,
        amount: transaction.amount,
        mainCategory: transaction.mainCategory,
        subCategory: transaction.subCategory
      });
      
      // Add amount to the appropriate category
      if (type === 'income') {
        stats.income += transaction.amount;
        console.log(`Added ${transaction.amount} to income, now: ${stats.income}`);
      } else if (type === 'expense') {
        stats.expense += transaction.amount;
        console.log(`Added ${transaction.amount} to expense, now: ${stats.expense}`);
      } else if (type === 'savings') {
        stats.savings += transaction.amount;
        console.log(`Added ${transaction.amount} to savings, now: ${stats.savings}`);
      } else if (type === 'investment') {
        stats.investment += transaction.amount;
        console.log(`Added ${transaction.amount} to investment, now: ${stats.investment}`);
      } else {
        console.log(`WARNING: Unknown transaction type: ${type}`);
      }
      
      stats.total += transaction.amount;
    });

    console.log('Final stats:', stats);
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
    setTransactions(updatedTransactions);

    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setShowAddTransaction(false);
      resetTransactionForm();
      
      // Recalculate stats immediately
      calculateTransactionStats();
      
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
            
            setTransactions(updatedTransactions);
            
            try {
              await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
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

    setTransactions(updatedTransactions);

    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setShowAddTransaction(false);
      resetTransactionForm();
      setEditingTransactionId(null);
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
  };

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory('');
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const renderDistributionBar = () => {
    const total = transactionStats.income + transactionStats.expense + transactionStats.savings + transactionStats.investment;
    if (total === 0) return null;
    
    const incomeWidth = (transactionStats.income / total) * 100;
    const expenseWidth = (transactionStats.expense / total) * 100;
    const savingsWidth = (transactionStats.savings / total) * 100;
    const investmentWidth = (transactionStats.investment / total) * 100;
    
    return (
      <View style={styles.distributionContainer}>
        <Text style={[styles.distributionTitle, { color: theme.text }]}>Distribution</Text>
        <View style={styles.distributionBar}>
          <View style={[styles.distributionSegment, { width: `${incomeWidth}%`, backgroundColor: '#10b981' }]} />
          <View style={[styles.distributionSegment, { width: `${expenseWidth}%`, backgroundColor: '#ef4444' }]} />
          <View style={[styles.distributionSegment, { width: `${savingsWidth}%`, backgroundColor: '#1e40af' }]} />
          <View style={[styles.distributionSegment, { width: `${investmentWidth}%`, backgroundColor: '#8e44ad' }]} />
        </View>
        <View style={styles.distributionLabels}>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Income</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#ef4444' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Expense</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#1e40af' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Savings</Text>
          </View>
          <View style={styles.distributionLabel}>
            <View style={[styles.labelDot, { backgroundColor: '#8e44ad' }]} />
            <Text style={[styles.labelText, { color: theme.text }]}>Investment</Text>
          </View>
        </View>
        
        <View style={styles.distributionValues}>
          <Text style={[styles.distributionValueText, { color: theme.text }]}>
            Income: {userData.currency}{transactionStats.income.toFixed(2)} ({((transactionStats.income / total) * 100).toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text }]}>
            Expense: {userData.currency}{transactionStats.expense.toFixed(2)} ({((transactionStats.expense / total) * 100).toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text }]}>
            Savings: {userData.currency}{transactionStats.savings.toFixed(2)} ({((transactionStats.savings / total) * 100).toFixed(1)}%)
          </Text>
          <Text style={[styles.distributionValueText, { color: theme.text }]}>
            Investment: {userData.currency}{transactionStats.investment.toFixed(2)} ({((transactionStats.investment / total) * 100).toFixed(1)}%)
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
      return [
        { name: 'No Data', population: 1, color: theme.primary, legendFontColor: theme.text, legendFontSize: 12 }
      ];
    }

    const total = transactionStats.income + transactionStats.expense + transactionStats.savings + transactionStats.investment;
    if (total === 0) {
      return [
        { name: 'No Data', population: 1, color: theme.primary, legendFontColor: theme.text, legendFontSize: 12 }
      ];
    }
    
    const data = [];
    
    if (transactionStats.income > 0) {
      const percentage = ((transactionStats.income / total) * 100).toFixed(1);
      data.push({
        name: `Income ${percentage}%`,
        population: transactionStats.income,
        color: '#10b981', // Green
        legendFontColor: theme.text,
        legendFontSize: 12
      });
    }
    
    if (transactionStats.expense > 0) {
      const percentage = ((transactionStats.expense / total) * 100).toFixed(1);
      data.push({
        name: `Expense ${percentage}%`,
        population: transactionStats.expense,
        color: '#ef4444', // Red
        legendFontColor: theme.text,
        legendFontSize: 12
      });
    }
    
    if (transactionStats.savings > 0) {
      const percentage = ((transactionStats.savings / total) * 100).toFixed(1);
      data.push({
        name: `Savings ${percentage}%`,
        population: transactionStats.savings,
        color: '#1e40af', // Dark Blue
        legendFontColor: theme.text,
        legendFontSize: 12
      });
    }
    
    if (transactionStats.investment > 0) {
      const percentage = ((transactionStats.investment / total) * 100).toFixed(1);
      data.push({
        name: `Investment ${percentage}%`,
        population: transactionStats.investment,
        color: '#8e44ad', // Purple
        legendFontColor: theme.text,
        legendFontSize: 12
      });
    }
    
    return data;
  };

  // Generate category-based pie chart data
  const generateCategoryPieChartData = () => {
    if (transactions.length === 0) {
      return [
        { name: 'No Data', population: 1, color: theme.primary, legendFontColor: theme.text, legendFontSize: 12 }
      ];
    }

    // Group transactions by main category
    const categoryTotals = {};
    const categoryColors = {
      'Bills & Utilities': '#FF5733',
      'Housing': '#C70039',
      'Food': '#900C3F',
      'Transportation': '#581845',
      'Healthcare': '#2471A3',
      'Education': '#148F77',
      'Personal': '#D4AC0D',
      'Others': '#A6ACAF',
      'Salary': '#27AE60',
      'Business': '#2E86C1',
      'Other Income': '#F39C12',
      'Emergency Fund': '#3498DB',
      'Retirement': '#1ABC9C',
      'Goals': '#F1C40F',
      'Stocks': '#8E44AD',
      'Mutual Funds': '#2E86C1',
      'Real Estate': '#C70039',
      'Crypto': '#8E44AD',
      'Commodities': '#581845'
    };
    
    // Calculate totals for each category
    transactions.forEach(transaction => {
      if (!categoryTotals[transaction.mainCategory]) {
        categoryTotals[transaction.mainCategory] = 0;
      }
      categoryTotals[transaction.mainCategory] += transaction.amount;
    });
    
    // Calculate total amount for percentage calculation
    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    // Convert to pie chart data format
    const data = Object.entries(categoryTotals).map(([category, amount]) => {
      const percentage = ((amount / totalAmount) * 100).toFixed(1);
      return {
        name: `${category} ${percentage}%`,
        population: amount,
        color: categoryColors[category] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
        legendFontColor: theme.text,
        legendFontSize: 12
      };
    });
    
    // Limit to top 5 categories if there are too many
    return data.sort((a, b) => b.population - a.population).slice(0, 5);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContainer}>
          <Header title="KUBERAX" />
          
          <View style={styles.headerTop}>
            <Text style={[styles.welcomeText, { color: theme.text }]}>
              Welcome, {userData?.name || 'User'}!
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={toggleTheme}
              >
                <MaterialCommunityIcons
                  name={isDarkMode ? "weather-sunny" : "weather-night"}
                  size={28}
                  color={theme.text}
                />
                <Text style={[styles.iconText, { color: theme.text }]}>Theme</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowCurrencyConverter(true)}
              >
                <MaterialCommunityIcons
                  name="currency-exchange"
                  size={28}
                  color={theme.text}
                />
                <Text style={[styles.iconText, { color: theme.text }]}>Currency</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.navigate('StockMarket')}
              >
                <MaterialCommunityIcons
                  name="chart-line"
                  size={28}
                  color={theme.text}
                />
                <Text style={[styles.iconText, { color: theme.text }]}>Stocks</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowVisualization(true)}
              >
                <MaterialCommunityIcons
                  name="chart-pie"
                  size={28}
                  color={theme.text}
                />
                <Text style={[styles.iconText, { color: theme.text }]}>Charts</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
            <Text style={[styles.balanceLabel, { color: '#ffffff' }]}>
              Total Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: '#ffffff' }]}>
              {userData.currency || '$'} {transactionStats.total.toFixed(2)}
            </Text>
          </View>
          
          {renderDistributionBar()}
          
          <View style={styles.recentTransactions}>
            <View style={styles.sectionHeader}>
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
              transactions.slice(0, 5).map((transaction, index) => (
                <View 
                  key={index} 
                  style={[styles.transactionItem, { backgroundColor: theme.card }]}
                >
                  <View style={styles.transactionIcon}>
                    <MaterialCommunityIcons 
                      name={
                        transaction.type === 'income' ? 'arrow-down-circle' : 
                        transaction.type === 'expense' ? 'arrow-up-circle' : 
                        transaction.type === 'savings' ? 'bank' :
                        transaction.type === 'investment' ? 'chart-pie' : 'bank'
                      } 
                      size={24} 
                      color={getTransactionColor(transaction.type)} 
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionCategory, { color: theme.text }]}>
                      {transaction.mainCategory}
                      {transaction.subCategory ? ` - ${transaction.subCategory}` : ''}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.subtext }]}>
                      {formatDate(transaction.date)} at {formatTime(transaction.date)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount, 
                    { color: getTransactionColor(transaction.type) }
                  ]}>
                    {transaction.type === 'expense' ? '-' : '+'}{userData.currency || '$'}{transaction.amount}
                  </Text>
                </View>
              ))
            )}
            
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowAddTransaction(true)}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Currency Converter Modal */}
      <CurrencyConverter 
        visible={showCurrencyConverter} 
        onClose={() => setShowCurrencyConverter(false)} 
      />

      {/* Visualization Modal */}
      <Modal
        visible={showVisualization}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVisualization(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: theme.card,
              maxHeight: '90%',
              marginTop: 'auto'
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Transaction Visualization
              </Text>
              <TouchableOpacity 
                onPress={() => setShowVisualization(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }} 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={styles.chartSection}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  Transaction Type Distribution
                </Text>
                {transactions.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.subtext }]}>
                    No transactions to visualize
                  </Text>
                ) : (
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={generatePieChartData()}
                      width={width - 40}
                      height={220}
                      chartConfig={{
                        backgroundColor: theme.card,
                        backgroundGradientFrom: theme.card,
                        backgroundGradientTo: theme.card,
                        color: (opacity = 1) => `rgba(${theme.text === '#ffffff' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                )}
              </View>

              <View style={styles.chartSection}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  Top Categories
                </Text>
                {transactions.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.subtext }]}>
                    No transactions to visualize
                  </Text>
                ) : (
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={generateCategoryPieChartData()}
                      width={width - 40}
                      height={220}
                      chartConfig={{
                        backgroundColor: theme.card,
                        backgroundGradientFrom: theme.card,
                        backgroundGradientTo: theme.card,
                        color: (opacity = 1) => `rgba(${theme.text === '#ffffff' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                )}
              </View>

              <View style={styles.chartLegend}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>
                  Legend
                </Text>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                  <Text style={[styles.legendText, { color: theme.text }]}>Income</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                  <Text style={[styles.legendText, { color: theme.text }]}>Expense</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#1e40af' }]} />
                  <Text style={[styles.legendText, { color: theme.text }]}>Savings</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#8e44ad' }]} />
                  <Text style={[styles.legendText, { color: theme.text }]}>Investment</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Transaction Modal - FIXED */}
      <Modal
        visible={showAddTransaction}
        animationType="slide"
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
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
            <View style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.card,
                maxHeight: '90%', // Reduced from 95% to ensure it fits on screen
                marginTop: 'auto',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                paddingBottom: Platform.OS === 'ios' ? 40 : 20
              }
            ]}>
              <View style={[styles.modalHeader, { 
                borderBottomWidth: 1, 
                borderBottomColor: theme.border,
                paddingVertical: 15,
                backgroundColor: theme.primary,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
              }]}>
                <Text style={[styles.modalTitle, { color: '#ffffff', fontSize: 24 }]}>
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
                style={{ flex: 1 }} 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 15, paddingTop: 15 }}
              >
                <View style={[styles.formSection, { marginTop: 10 }]}>
                  <Text style={[styles.formLabel, { color: theme.text, fontSize: 20 }]}>
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

                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 20 }]}>
                    Select Transaction Type
                  </Text>
                  <View style={styles.typeSelector}>
                    {/* Income Button */}
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'income' ? '#10b981' : 'rgba(16, 185, 129, 0.2)',
                          borderWidth: transactionType === 'income' ? 0 : 1,
                          borderColor: '#10b981',
                          height: 70,
                          width: '48%'
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('income')}
                    >
                      <MaterialCommunityIcons 
                        name="arrow-down-circle" 
                        size={28} 
                        color={transactionType === 'income' ? '#ffffff' : '#10b981'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'income' ? '#ffffff' : '#10b981', fontSize: 16 }
                      ]}>
                        Income
                      </Text>
                    </TouchableOpacity>

                    {/* Expense Button */}
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'expense' ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                          borderWidth: transactionType === 'expense' ? 0 : 1,
                          borderColor: '#ef4444',
                          height: 70,
                          width: '48%'
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('expense')}
                    >
                      <MaterialCommunityIcons 
                        name="arrow-up-circle" 
                        size={28} 
                        color={transactionType === 'expense' ? '#ffffff' : '#ef4444'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'expense' ? '#ffffff' : '#ef4444', fontSize: 16 }
                      ]}>
                        Expense
                      </Text>
                    </TouchableOpacity>

                    {/* Savings Button */}
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'savings' ? '#1e40af' : 'rgba(30, 64, 175, 0.2)',
                          borderWidth: transactionType === 'savings' ? 0 : 1,
                          borderColor: '#1e40af',
                          height: 70,
                          width: '48%',
                          marginTop: 10
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('savings')}
                    >
                      <MaterialCommunityIcons 
                        name="bank" 
                        size={28} 
                        color={transactionType === 'savings' ? '#ffffff' : '#1e40af'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'savings' ? '#ffffff' : '#1e40af', fontSize: 16 }
                      ]}>
                        Savings
                      </Text>
                    </TouchableOpacity>

                    {/* Investment Button */}
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: transactionType === 'investment' ? '#8e44ad' : 'rgba(142, 68, 173, 0.2)',
                          borderWidth: transactionType === 'investment' ? 0 : 1,
                          borderColor: '#8e44ad',
                          height: 70,
                          width: '48%',
                          marginTop: 10
                        }
                      ]}
                      onPress={() => handleTransactionTypeSelect('investment')}
                    >
                      <MaterialCommunityIcons 
                        name="chart-pie" 
                        size={28} 
                        color={transactionType === 'investment' ? '#ffffff' : '#8e44ad'} 
                      />
                      <Text style={[
                        styles.typeButtonText, 
                        { color: transactionType === 'investment' ? '#ffffff' : '#8e44ad', fontSize: 16 }
                      ]}>
                        Investment
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {transactionType && (
                  <View style={styles.formSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 20 }]}>
                      Select Category
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                      <View style={styles.categoryGrid}>
                        {Object.keys(transactionCategories[transactionType.toLowerCase()] || {}).map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              styles.categoryCard,
                              {
                                backgroundColor: selectedMainCategory === category 
                                  ? getTransactionColor(transactionType) 
                                  : theme.background,
                                borderColor: getTransactionColor(transactionType),
                                borderWidth: 2,
                                marginRight: 15,
                                minWidth: 150,
                                height: 60
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
                  <View style={styles.formSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15, fontSize: 20 }]}>
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
                                ? getTransactionColor(transactionType) 
                                : theme.background,
                              borderColor: getTransactionColor(transactionType),
                              borderWidth: 2,
                              height: 55
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

                <View style={styles.actionButtons}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 15,
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
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
    height: 20,
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
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    width: '48%',
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  labelText: {
    fontSize: 14,
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
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    borderRadius: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  typeButton: {
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  categoryCard: {
    minWidth: 120,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryCardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  subCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  subCategoryCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtons: {
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  chartSection: {
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartLegend: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
  distributionValues: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  distributionValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default HomeScreen;