import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert('Sign in failed', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Wandr</Text>
      <Text style={styles.subtitle}>Discover your next adventure</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 40, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 8, marginBottom: 40 },
  form: { gap: 16 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#6366f1', fontSize: 14, marginTop: 8 },
});
