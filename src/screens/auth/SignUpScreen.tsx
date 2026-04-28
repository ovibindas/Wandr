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

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Check your email', 'We sent a confirmation link to ' + email);
      navigation.navigate('SignIn');
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start exploring the world</Text>

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
          placeholder="Password (min 8 characters)"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating account…' : 'Sign Up'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
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
