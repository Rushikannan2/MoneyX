import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const QuizScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = [
    {
      question: "What is a stock?",
      options: [
        "A type of bond",
        "Ownership share in a company",
        "A mutual fund",
        "A savings account"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a bull market?",
      options: [
        "Market is declining",
        "Market is stable",
        "Market is rising",
        "Market is closed"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a P/E ratio?",
      options: [
        "Price to Earnings",
        "Profit to Expense",
        "Payment to Equity",
        "Performance to Efficiency"
      ],
      correctAnswer: 0
    },
    {
      question: "Which is a characteristic of a bear market?",
      options: [
        "Rising prices",
        "High investor confidence",
        "20%+ decline from recent highs",
        "Increasing trade volume"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a stop-loss order?",
      options: [
        "An order to buy at market price",
        "An order to sell when price reaches a specified low",
        "An order to buy more shares",
        "An order to hold stocks longer"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Stock Market Quiz</Text>
      </View>

      <ScrollView style={styles.content}>
        {showScore ? (
          <View style={[styles.scoreContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.scoreText, { color: theme.text }]}>
              You scored {score} out of {questions.length}!
            </Text>
            <TouchableOpacity
              style={[styles.restartButton, { backgroundColor: theme.primary }]}
              onPress={restartQuiz}
            >
              <Text style={styles.restartButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.questionContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.questionCounter, { color: theme.subtext }]}>
              Question {currentQuestion + 1}/{questions.length}
            </Text>
            <Text style={[styles.questionText, { color: theme.text }]}>
              {questions[currentQuestion].question}
            </Text>
            <View style={styles.optionsContainer}>
              {questions[currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, { backgroundColor: theme.primary }]}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionCounter: {
    fontSize: 16,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  scoreContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restartButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen; 