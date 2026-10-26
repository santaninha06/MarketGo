import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, Pressable, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenContainer } from '@/components/ScreenContainer';
import { signIn } from '@/services/auth';
import { signInSchema } from '@/schemas/auth';
import { colors, spacing } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleLogin() {
    setEmailError('');
    setPasswordError('');

    const validation = signInSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        if (issue.path[0] === 'email') {
          setEmailError(issue.message);
        }

        if (issue.path[0] === 'password') {
          setPasswordError(issue.message);
        }
      }

      return;
    }

    setLoading(true);

    try {
      await signIn(validation.data);
      router.replace('/');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível entrar na sua conta.';

      Alert.alert('Erro no login', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.back}>← Voltar para as lojas</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.emoji}>🛍️</Text>
        <Text style={styles.brand}>
          Market<Text style={styles.brandAccent}>Go</Text>
        </Text>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Entre na sua conta para continuar.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={emailError}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          error={passwordError}
        />

        <Button title="Entrar" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
          <Pressable onPress={() => router.push('/(app)/auth/signup')}>
            <Text style={styles.link}>Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 42,
  },
  brand: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  brandAccent: {
    color: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '800',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
