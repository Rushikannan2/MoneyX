import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const StudyGuideScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();

  const sections = [
    {
      title: '📚 Stock Trading Basics',
      icon: 'school',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: `Essential knowledge for beginners:\n
• Stocks represent ownership in companies
• Prices fluctuate based on supply/demand
• Orders types: Market, Limit, Stop-loss
• Exchanges: NYSE, NASDAQ, etc.
• Trading hours: 9:30 AM - 4 PM EST\n
Key Takeaway: Start with paper trading before risking real money`,
    },
    {
      title: '📈 Stock Types & Categories',
      icon: 'category',
      image: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg',
      content: `Market Capitalization Classes:\n
🟦 Large-cap ($10B+): 
- Stable companies (Apple, Microsoft)
- Lower volatility, steady dividends\n
🟩 Mid-cap ($2B-$10B): 
- Growing companies (Etsy, DocuSign)
- Moderate risk/reward balance\n
🟥 Small-cap (<$2B): 
- Emerging companies
- High growth potential, higher risk`,
    },
    {
      title: '💡 Investment Strategies',
      icon: 'strategy',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: `Proven Approaches:\n
🌟 Buy & Hold: 
- Long-term (5+ years)
- Weather market fluctuations\n
🔍 Value Investing: 
- Find undervalued stocks 
- Look for low P/E ratios\n
🚀 Growth Investing: 
- Focus on revenue growth
- Tech startups, innovative sectors\n
💰 Dividend Investing: 
- Steady income stream
- Reinvest dividends for compounding`,
    },
    {
      title: '⚠️ Risk Management',
      icon: 'warning',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: `Essential Protection Strategies:\n
• Never invest more than 5% in one stock
• Maintain diversified portfolio
• Use stop-loss orders
• Understand your risk tolerance
• Regularly rebalance portfolio\n
Golden Rule: "Never try to catch a falling knife" - Avoid buying rapidly declining stocks`,
    },
    {
      title: '📊 Market Analysis',
      icon: 'analytics',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: `Key Analysis Methods:\n
🔍 Fundamental Analysis:
- Financial statements
- P/E ratio, EPS, Debt/Equity\n
📈 Technical Analysis:
- Price patterns
- Moving averages
- RSI, MACD indicators\n
🌍 Sector Analysis:
- Industry trends
- Economic cycles
- Government policies`,
    },
    {
      title: '📖 Success Story',
      icon: 'emoji-events',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: `Meet Sarah's Journey:\n
2018: Started with $5,000 savings
2019: Learned value investing
2020: Invested in pandemic recovery stocks
2021: Portfolio grew to $25,000
2023: Reached $50,000 through disciplined investing\n
Her Strategy:
✅ Monthly SIP investments
✅ Strict 5% per stock rule
✅ Regular portfolio review
✅ Emotional discipline during crashes`,
    },
  ];

  const chartPatterns = [
    {
      title: '📈 Classic Chart Patterns',
      icon: 'insert-chart',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: {
        description: "Master these essential patterns to predict price movements:",
        patterns: [
          {
            name: 'U-Shaped Recovery',
            symbol: '⛰',
            characteristics: [
              'Gradual decline followed by gradual recovery',
              'Forms rounded bottom pattern',
              'Typical duration: 3-6 months',
              'Volume decreases during consolidation'
            ],
            example: '2020 Oil Market Recovery',
            strategy: 'Accumulate during flat bottom phase'
          },
          {
            name: 'V-Shaped Reversal',
            symbol: '🔻',
            characteristics: [
              'Sharp decline followed by immediate recovery',
              'Forms V pattern on chart',
              'Completed in weeks',
              'High volatility'
            ],
            example: 'COVID Market Crash & Recovery',
            strategy: 'Watch for hammer candles at bottom'
          },
          {
            name: 'W-Double Bottom',
            symbol: '🏔',
            characteristics: [
              'Two distinct price bottoms',
              'Confirmation at resistance break',
              'Bullish reversal pattern',
              'Neckline acts as key level'
            ],
            example: '2009 Financial Crisis Bottom',
            strategy: 'Buy on second bounce with volume'
          }
        ]
      }
    },
    {
      title: '🐂 Bull Market Strategies',
      icon: 'trending-up',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: {
        description: "Thriving in rising markets:",
        characteristics: [
          '↗️ Sustained upward trend (18+ months)',
          '💰 Sector rotation opportunities',
          '📈 Higher highs & higher lows',
          '😊 Optimistic investor sentiment',
          '🔥 Momentum stocks outperform'
        ],
        phases: [
          { name: 'Stealth Phase', tip: 'Accumulate undervalued stocks' },
          { name: 'Awareness Phase', tip: 'Follow institutional buying' },
          { name: 'Mania Phase', tip: 'Take profits cautiously' }
        ],
        example: '2020-2021 Tech Rally',
        warning: 'Avoid FOMO (Fear of Missing Out)'
      }
    },
    {
      title: '🐻 Bear Market Survival',
      icon: 'trending-down',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: {
        description: "Navigating market downturns:",
        characteristics: [
          '↘️ 20%+ decline from highs',
          '⌛ Duration: 6-18 months',
          '💔 Lower lows & lower highs',
          '😨 Panic selling phases',
          '🛡️ Defensive stocks perform better'
        ],
        strategies: [
          'Build cash reserves',
          'Short-term trading opportunities',
          'Dividend aristocrats',
          'Inverse ETFs for hedging'
        ],
        example: '2008 Financial Crisis',
        tip: "Don't try to catch falling knives"
      }
    },
    {
      title: '🚩 Flag Patterns',
      icon: 'flag',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      content: {
        types: [
          {
            name: 'Bull Flag',
            pattern: '▲▼▲',
            characteristics: [
              'Sharp rise → consolidation → breakout',
              'Volume declines during flag',
              'Measured move target'
            ],
            entry: 'Breakout above flag'
          },
          {
            name: 'Bear Flag',
            pattern: '▼▲▼',
            characteristics: [
              'Sharp drop → consolidation → breakdown',
              'Volume spikes on breakdown',
              'Target = flagpole length'
            ],
            entry: 'Break below support'
          }
        ],
        example: '2022 Bitcoin Bear Flag',
        tip: 'Trade in direction of prevailing trend'
      }
    }
  ];

  const openExternalLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const renderPatternSection = (section) => {
    return (
      <View key={section.title} style={[styles.section, { backgroundColor: theme.card }]}>
        <Image source={{ uri: section.image }} style={styles.sectionImage} />
        <View style={styles.sectionHeader}>
          <MaterialIcons name={section.icon} size={24} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
        </View>

        {section.content.description && (
          <Text style={[styles.content, { color: theme.subtext }]}>
            {section.content.description}
          </Text>
        )}

        {section.content.characteristics && (
          <View style={styles.contentSection}>
            <Text style={[styles.subHeader, { color: theme.primary }]}>Characteristics:</Text>
            {section.content.characteristics.map((char, i) => (
              <Text key={i} style={[styles.listItem, { color: theme.subtext }]}>• {char}</Text>
            ))}
          </View>
        )}

        {section.content.phases && (
          <View style={styles.contentSection}>
            <Text style={[styles.subHeader, { color: theme.primary }]}>Market Phases:</Text>
            {section.content.phases.map((phase, index) => (
              <View key={index} style={styles.phaseContainer}>
                <Text style={[styles.phaseName, { color: theme.text }]}>• {phase.name}</Text>
                <Text style={[styles.phaseTip, { color: theme.subtext }]}>  {phase.tip}</Text>
              </View>
            ))}
          </View>
        )}

        {section.content.strategies && (
          <View style={styles.contentSection}>
            <Text style={[styles.subHeader, { color: theme.primary }]}>Strategies:</Text>
            {section.content.strategies.map((strategy, i) => (
              <Text key={i} style={[styles.listItem, { color: theme.subtext }]}>• {strategy}</Text>
            ))}
          </View>
        )}

        {section.content.patterns?.map((pattern, index) => (
          <View key={index} style={styles.patternContainer}>
            <View style={styles.patternHeader}>
              <Text style={[styles.patternSymbol, { color: theme.primary }]}>{pattern.symbol}</Text>
              <Text style={[styles.patternName, { color: theme.text }]}>{pattern.name}</Text>
            </View>
            <Text style={[styles.subHeader, { color: theme.primary }]}>Characteristics:</Text>
            {pattern.characteristics.map((char, i) => (
              <Text key={i} style={[styles.listItem, { color: theme.subtext }]}>• {char}</Text>
            ))}
            <Text style={[styles.exampleText, { color: theme.primary }]}>Example: {pattern.example}</Text>
            <Text style={[styles.strategyText, { color: theme.text }]}>Strategy: {pattern.strategy}</Text>
          </View>
        ))}

        {section.content.types?.map((type, index) => (
          <View key={index} style={styles.patternContainer}>
            <View style={styles.patternHeader}>
              <Text style={[styles.patternName, { color: theme.text }]}>{type.name}</Text>
              <Text style={[styles.patternSymbol, { color: theme.primary }]}>{type.pattern}</Text>
            </View>
            {type.characteristics.map((char, i) => (
              <Text key={i} style={[styles.listItem, { color: theme.subtext }]}>• {char}</Text>
            ))}
            <Text style={[styles.strategyText, { color: theme.text }]}>Entry: {type.entry}</Text>
          </View>
        ))}

        {section.content.example && (
          <Text style={[styles.exampleText, { color: theme.primary, marginTop: 10, marginLeft: 16 }]}>
            Example: {section.content.example}
          </Text>
        )}

        {section.content.warning && (
          <Text style={[styles.warningText, { color: theme.error, marginTop: 10, marginLeft: 16 }]}>
            ⚠️ {section.content.warning}
          </Text>
        )}

        {section.content.tip && (
          <Text style={[styles.tipText, { color: theme.primary, marginTop: 10, marginLeft: 16 }]}>
            💡 Tip: {section.content.tip}
          </Text>
        )}
      </View>
    );
  };

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
        <Text style={[styles.headerText, { color: theme.text }]}>Ultimate Stock Guide</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { 
            backgroundColor: theme.card,
            shadowColor: isDarkMode ? '#000000' : '#000000'
          }]}>
            <Image
              source={{ uri: section.image }}
              style={styles.sectionImage}
              resizeMode="cover"
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.sectionHeader}>
              <MaterialIcons name={section.icon} size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            </View>
            <Text style={[styles.content, { color: theme.subtext }]}>{section.content}</Text>
            
            {index === sections.length - 1 && (
              <TouchableOpacity 
                style={[styles.quizButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  try {
                    navigation.navigate('QuizScreen');
                  } catch (error) {
                    Alert.alert(
                      'Coming Soon',
                      'The quiz feature will be available in the next update!',
                      [{ text: 'OK', onPress: () => console.log('Quiz alert closed') }]
                    );
                  }
                }}
              >
                <FontAwesome name="question-circle" size={20} color="white" />
                <Text style={styles.quizButtonText}>Test Your Knowledge</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {chartPatterns.map(renderPatternSection)}

        <TouchableOpacity
          style={[styles.resourceCard, { backgroundColor: theme.card }]}
          onPress={() => openExternalLink('https://www.investopedia.com/')}
        >
          <Text style={[styles.resourceText, { color: theme.primary }]}>
            📚 Recommended Reading: "The Intelligent Investor" by Benjamin Graham
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.interactiveCard, { backgroundColor: theme.primary }]}
          onPress={() => Linking.openURL('https://www.tradingview.com/')}
        >
          <FontAwesome name="line-chart" size={24} color="white" />
          <Text style={styles.interactiveText}>Practice Live Chart Analysis →</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  section: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionImage: {
    height: 200,
    width: '100%',
    opacity: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    flexShrink: 1,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    padding: 16,
    paddingTop: 8,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    margin: 16,
    justifyContent: 'center',
    gap: 10,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resourceCard: {
    padding: 20,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
    elevation: 2,
  },
  resourceText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 4,
  },
  patternContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  patternSymbol: {
    fontSize: 24,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '600',
  },
  phaseContainer: {
    marginBottom: 8,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  phaseTip: {
    fontSize: 15,
    marginLeft: 16,
  },
  exampleText: {
    fontSize: 15,
    fontWeight: '500',
  },
  warningText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  strategyText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
  },
  interactiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 15,
    justifyContent: 'center',
    marginVertical: 10
  },
  interactiveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
});

export default StudyGuideScreen;