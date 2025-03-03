import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    currency: '',
  });

  // Step-specific images
  const stepImages = {
    name: 'https://i.imgur.com/ux5cTxb.png',
    age: 'https://i.imgur.com/80qTLhA.png',
    gender: 'https://i.imgur.com/TRbpXDp.png',
    currency: 'https://i.imgur.com/Er3XEFe.png', // Replaced blob URL with assumed correct URL
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD'];
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    AUD: 'A$',
  };

  const onboardingSteps = [
    {
      id: 'name',
      title: 'Welcome to KUBERA-X! 👋',
      subtitle: "What's your name?",
      placeholder: 'Enter your name',
      type: 'text',
    },
    {
      id: 'age',
      title: 'Hi there! 🎉',
      subtitle: 'How old are you?',
      placeholder: 'Enter your age',
      type: 'number',
    },
    {
      id: 'gender',
      title: 'Tell us about yourself',
      subtitle: 'What is your gender?',
      type: 'options',
      options: ['Male', 'Female', 'Other'],
    },
    {
      id: 'currency',
      title: 'Choose Your Currency',
      subtitle: 'Select your preferred currency',
      type: 'options',
      options: currencies,
    },
  ];

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('onboardingCompleted', 'true');
        navigation.replace('Home');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const isNextDisabled = () => {
    const currentField = onboardingSteps[currentStep].id;
    return !userData[currentField];
  };

  const renderInput = () => {
    const step = onboardingSteps[currentStep];
    if (!step) return null;

    switch (step.type) {
      case 'text':
      case 'number':
        return (
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            }]}
            placeholder={step.placeholder}
            placeholderTextColor={theme.text + '80'}
            value={userData[step.id]}
            onChangeText={(text) => 
              setUserData({ ...userData, [step.id]: text })
            }
            keyboardType={step.type === 'number' ? 'numeric' : 'default'}
            autoFocus
          />
        );
      case 'options':
        return (
          <ScrollView style={styles.optionsContainer}>
            {step.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: userData[step.id] === option ? theme.primary : theme.card,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => 
                  setUserData({ ...userData, [step.id]: option })
                }
              >
                <Text style={[
                  styles.optionText,
                  { color: userData[step.id] === option ? '#ffffff' : theme.text },
                ]}>
                  {step.id === 'currency' ? `${currencySymbols[option]} ${option}` : option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Dynamic Step Image */}
            <Image
              source={{ uri: stepImages[onboardingSteps[currentStep].id] }}
              style={styles.stepImage}
              resizeMode="contain"
            />
            
            <Text style={styles.stepIndicator}>
              Step {currentStep + 1} of {onboardingSteps.length}
            </Text>
            
            <Text style={styles.title}>
              {onboardingSteps[currentStep]?.title || ''}
            </Text>
            
            <Text style={styles.subtitle}>
              {onboardingSteps[currentStep]?.subtitle || ''}
            </Text>

            {renderInput()}

            <TouchableOpacity
              style={[
                styles.nextButton,
                isNextDisabled() && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={isNextDisabled()}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === onboardingSteps.length - 1 ? 'Start Budgeting!' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  stepImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  stepIndicator: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    maxHeight: 300,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 30,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#192f6a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;