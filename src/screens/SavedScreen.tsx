import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>Your saved places will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#94a3b8', marginTop: 8 },
});
