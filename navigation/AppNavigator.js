import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StockMarketScreen from '../screens/StockMarketScreen';
import StudyGuideScreen from '../screens/StudyGuideScreen';
import InvestScreen from '../screens/InvestScreen';
import QuizScreen from '../screens/QuizScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F5F5F5' },
      }}
    >
      <Stack.Screen name="StockMarket" component={StockMarketScreen} />
      <Stack.Screen name="StudyGuide" component={StudyGuideScreen} />
      <Stack.Screen name="Invest" component={InvestScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 