import { signInSchema, signUpSchema } from '@/schemas/auth';

describe('Validação de autenticação', () => {
  it('aceita e-mail e senha válidos no login', () => {
    expect(
      signInSchema.safeParse({
        email: 'teste@marketgo.com',
        password: '123456',
      }).success,
    ).toBe(true);
  });

  it('rejeita e-mail inválido', () => {
    expect(
      signInSchema.safeParse({
        email: 'email-invalido',
        password: '123456',
      }).success,
    ).toBe(false);
  });

  it('rejeita senhas diferentes no cadastro', () => {
    expect(
      signUpSchema.safeParse({
        name: 'Gabriel',
        email: 'teste@marketgo.com',
        password: '123456',
        confirmPassword: '654321',
      }).success,
    ).toBe(false);
  });
});
