import bcrypt from 'bcryptjs';

// Tipos das funções de hash
export async function hashPassword(password: string): Promise<string> {
  if (password.length > 24) {
    return password;
  }
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}