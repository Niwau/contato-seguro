import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = (target: string) => bcrypt.hash(target, SALT_ROUNDS);
