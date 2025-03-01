import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const AchievementsScreen = ({ route }) => {
  const { achievements, points } = route.params;

  // Define all possible achievements
  const allAchievements = {
    FIRST_TIME: [
      {
        id: 'first_transaction',
        title: 'First Step!',
        description: 'Made your first transaction',
        points: 100,
        icon: '🎉',
        animation: 'https://lottie.host/2c692d4b-c0b1-4ee4-b696-486eee4e7a50/JGfQKthvE1.json'
      },
      {
        id: 'first_savings',
        title: 'Savings Pioneer',
        description: 'Started your savings journey',
        points: 150,
        icon: '🏦',
        animation: 'https://lottie.host/7f726503-4f6c-4a51-9af0-c44f24a0b6b9/7Zn6UGsWE4.json'
      }
    ],
    MILESTONES: [
      {
        id: 'transactions_10',
        title: 'Transaction Master',
        description: 'Completed 10 transactions',
        points: 200,
        icon: '🎯',
        animation: 'https://lottie.host/b5c42947-9c6f-44c7-b89c-91544e6eb281/UHc9rjPLkA.json'
      },
      {
        id: 'savings_1000',
        title: 'Savings Champion',
        description: 'Reached 1000 in savings',
        points: 300,
        icon: '💰',
        animation: 'https://lottie.host/savings-animation.json'
      }
    ],
    STREAKS: [
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: '7-day tracking streak',
        points: 300,
        icon: '🔥',
        animation: 'https://lottie.host/c3d1f01b-3f69-4721-ae76-8eab32fb5c6c/2eQYxFsHOx.json'
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: '30-day tracking streak',
        points: 500,
        icon: '⭐',
        animation: 'https://lottie.host/streak-animation.json'
      }
    ]
  };

  const renderAchievementCard = (achievement, isUnlocked) => (
    <Animatable.View
      animation="fadeIn"
      duration={1000}
      style={[styles.achievementCard, !isUnlocked && styles.lockedAchievement]}
      key={achievement.id}
    >
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementTitleContainer}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementPoints}>+{achievement.points} points</Text>
        </View>
      </View>
      <Text style={styles.achievementDescription}>{achievement.description}</Text>
      {isUnlocked && (
        <LottieView
          source={{ uri: achievement.animation }}
          autoPlay
          loop={false}
          style={styles.achievementAnimation}
        />
      )}
      {!isUnlocked && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedText}>🔒 Locked</Text>
        </View>
      )}
    </Animatable.View>
  );

  return (
    <LinearGradient
      colors={['#4f46e5', '#3730a3']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>🏆 {points} Points</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(allAchievements).map(([category, categoryAchievements]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category.replace('_', ' ')}
            </Text>
            {categoryAchievements.map(achievement => 
              renderAchievementCard(
                achievement,
                achievements.some(a => a.id === achievement.id)
              )
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  pointsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  pointsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  achievementPoints: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementAnimation: {
    height: 100,
    alignSelf: 'center',
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
});

export default AchievementsScreen; 