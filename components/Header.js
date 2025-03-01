import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title = 'KUBERAX' }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, { color: theme.text }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Header; 