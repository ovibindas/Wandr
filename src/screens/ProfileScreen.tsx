import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  email: { fontSize: 16, color: '#64748b', marginTop: 8 },
  signOutButton: {
    marginTop: 40,
    height: 52,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});
