import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InvestScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Technology',
    'Finance',
    'Healthcare',
    'Energy',
    'Consumer',
  ];

  const stocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 173.57,
      change: +1.23,
      category: 'Technology',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 202.64,
      change: -0.89,
      category: 'Technology',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 178.22,
      change: +2.45,
      category: 'Technology',
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase',
      price: 147.31,
      change: +0.67,
      category: 'Finance',
    },
    {
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      price: 156.85,
      change: -0.34,
      category: 'Healthcare',
    },
    {
      symbol: 'XOM',
      name: 'Exxon Mobil',
      price: 104.76,
      change: +1.56,
      category: 'Energy',
    },
  ];

  const filteredStocks = stocks.filter(stock => {
    const matchesCategory = selectedCategory === 'All' || stock.category === selectedCategory;
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStockItem = ({ item }) => (
    <View style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockCategory}>{item.category}</Text>
      </View>
      <View style={styles.stockPriceContainer}>
        <Text style={styles.stockPrice}>${item.price.toFixed(2)}</Text>
        <Text style={[
          styles.stockChange,
          { color: item.change >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
        </Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Invest</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stocks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol}
        style={styles.stockList}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  stockList: {
    flex: 1,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stockName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stockCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  stockPriceContainer: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stockChange: {
    fontSize: 14,
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default InvestScreen; 