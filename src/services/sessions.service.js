import { getUserByEmail, saveUser } from "../repositories/users.repository.js";
import { createHash } from "../utils/hash.js";

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
