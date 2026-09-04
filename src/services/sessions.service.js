import { getUserByEmail, saveUser } from "../repositories/users.repository.js";
import { createHash } from "../utils/hash.js";
import { isValidPassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

export const registerUser = async ({
  first_name,
  last_name,
  email,
  password,
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await createHash(password);

  const newUser = await saveUser({
    first_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await getUserByEmail(normalizedEmail)

    if (!user) {
        throw new Error('INVALID_CREDENTIALS')
    }

    const validPassword = await isValidPassword(password, user.password)

    if (!validPassword) {
        throw new Error('INVALID_CREDENTIALS')
    }

    const tokenUser = { id: user._id, email: user.email, role: user.role }
    const token = generateToken(tokenUser)

    return token
}