import argon2 from "argon2";
import type { RegistrationInput } from "./auth.validation.js";
import { createUser } from "./auth.repository.js";

export async function registerUser(input: RegistrationInput) {
    const email = input.email;
    const emailNormalized = email.toLowerCase();

    const passwordHash = await argon2.hash(input.password);

    return createUser({
        email,
        emailNormalized,
        passwordHash,
    });
}