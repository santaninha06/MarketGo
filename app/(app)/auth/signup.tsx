import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenContainer } from '@/components/ScreenContainer';
import { signUp } from '@/services/auth';
import { signUpSchema } from '@/schemas/auth';
import { colors, spacing } from '@/theme';

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSignup() {
    setErrors({});

    const validation = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of validation.error.issues) {
        const field = String(issue.path[0]);

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(validation.data);

      if (result.user && !result.session) {
        Alert.alert(
          'Confira seu e-mail',
          'Sua conta foi criada. Confirme seu e-mail antes de entrar.',
          [{ text: 'OK', onPress: () => router.replace('/(app)/auth/login') }],
        );
        return;
      }

      Alert.alert('Conta criada!', 'Seu cadastro foi concluído com sucesso.', [
        { text: 'Continuar', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível criar sua conta.';

      Alert.alert('Erro no cadastro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.emoji}>🛍️</Text>
        <Text style={styles.brand}>
          Market<Text style={styles.brandAccent}>Go</Text>
        </Text>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>
          Faça seu cadastro para pedir nas suas lojas favoritas.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nome completo"
          placeholder="Digite seu nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          error={errors.name}
        />

        <Input
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.password}
        />

        <Input
          label="Confirmar senha"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <Button title="Criar minha conta" onPress={handleSignup} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <Pressable onPress={() => router.replace('/(app)/auth/login')}>
            <Text style={styles.link}>Entrar</Text>
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
    marginTop: spacing.lg,
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
