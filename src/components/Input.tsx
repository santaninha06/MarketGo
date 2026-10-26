import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, secureTextEntry = false, ...props }: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        secureTextEntry={hidden}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, error ? styles.inputError : undefined]}
      />

      {secureTextEntry && (
        <Text
          accessibilityRole="button"
          onPress={() => setHidden((current) => !current)}
          style={styles.toggle}
        >
          {hidden ? 'Mostrar senha' : 'Ocultar senha'}
        </Text>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
  toggle: {
    alignSelf: 'flex-end',
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
