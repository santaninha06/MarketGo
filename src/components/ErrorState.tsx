import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Button } from '@/components/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Não foi possível carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>

      <Text style={styles.title}>Ops! Algo deu errado.</Text>

      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <View style={styles.button}>
          <Button title="Tentar novamente" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 42,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  button: {
    width: '100%',
    marginTop: spacing.md,
  },
});
