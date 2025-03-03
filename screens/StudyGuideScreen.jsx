import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const StudyGuideScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  
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
        <Text style={[styles.headerText, { color: theme.text }]}>Stock Market Guide</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { 
            backgroundColor: theme.card,
            shadowColor: isDarkMode ? '#000000' : '#000000'
          }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name={section.icon} size={24} color={theme.text} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            </View>
            <Text style={[styles.content, { color: theme.subtext }]}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
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
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default StudyGuideScreen; 