import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './context/ThemeContext';
import HomeScreen from "./screens/HomeScreen";
import StockMarketScreen from './screens/StockMarketScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import StudyGuideScreen from './screens/StudyGuideScreen';
import InvestScreen from './screens/InvestScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      setHasCompletedOnboarding(onboardingCompleted === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or return a loading screen component
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={hasCompletedOnboarding ? "Home" : "Onboarding"}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {!hasCompletedOnboarding && (
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen}
                options={{ gestureEnabled: false }}
              />
            )}
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen}
              options={{ 
                title: 'Achievements',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#fff',
                headerShown: true
              }}
            />
            <Stack.Screen 
              name="StockMarket" 
              component={StockMarketScreen}
              options={{ 
                title: 'Stock Market',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#fff',
                headerShown: true
              }}
            />
            <Stack.Screen 
              name="StudyGuide" 
              component={StudyGuideScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen 
              name="Invest" 
              component={InvestScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 