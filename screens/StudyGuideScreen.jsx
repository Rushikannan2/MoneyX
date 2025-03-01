import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StudyGuideScreen = () => {
  const navigation = useNavigation();
  
  const sections = [
    {
      title: 'Basics of Stock Trading',
      icon: 'school',
      content: 'Stock trading involves buying and selling shares of publicly traded companies. When you buy a stock, you own a small piece of that company and can benefit from its growth and profits.',
    },
    {
      title: 'Types of Stocks',
      icon: 'category',
      content: 'Large-cap: Market value > $10B\nMid-cap: $2B-$10B\nSmall-cap: < $2B\nEach category offers different risk and growth potential.',
    },
    {
      title: 'Investment Strategies',
      icon: 'strategy',
      content: 'Long-term investing: Buy and hold for years\nValue investing: Look for undervalued stocks\nGrowth investing: Focus on companies with high growth potential\nDividend investing: Focus on stocks that pay regular dividends',
    },
    {
      title: 'Risks & Rewards',
      icon: 'warning',
      content: 'Risks: Market volatility, company performance, economic conditions\nRewards: Capital appreciation, dividends, portfolio diversification',
    },
    {
      title: 'Market Indicators',
      icon: 'analytics',
      content: 'Key indicators include:\n- Price-to-Earnings (P/E) Ratio\n- Moving Averages\n- Trading Volume\n- Market Indices (S&P 500, NASDAQ)',
    },
    {
      title: 'Stock Terms',
      icon: 'menu-book',
      content: 'IPO: Initial Public Offering\nBlue Chip: Large, stable companies\nDividend: Share of profits paid to stockholders\nBull Market: Rising market\nBear Market: Falling market',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Stock Market Guide</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name={section.icon} size={24} color="#333" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.content}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default StudyGuideScreen; 