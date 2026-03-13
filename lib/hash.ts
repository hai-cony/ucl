import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // 10–12 recommended

export async function hashPassword(password: string): Promise<string> {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
}
